import { checkIncludesPath, isEmpty, removeEmpty } from '.';

describe('Enabled if matches includes', () => {
  test('Top level: No includes', () => {
    expect(checkIncludesPath([], [])).toBe(true);
  });

  test('Top level: One include', () => {
    expect(checkIncludesPath(['uid'], [])).toBe(true);
  });

  test('Top level: Multiple includes', () => {
    expect(checkIncludesPath(['uid', 'node_type'], [])).toBe(true);
  });

  test('Relationship: No includes', () => {
    expect(checkIncludesPath([], ['uid'])).toBe(false);
  });

  test('Relationship: matching include', () => {
    expect(checkIncludesPath(['uid'], ['uid'])).toBe(true);
  });

  test('Relationship: mismatch include', () => {
    expect(checkIncludesPath(['node_type'], ['uid'])).toBe(false);
  });

  test('Relationship: matching include plus other', () => {
    expect(checkIncludesPath(['uid', 'node_type'], ['uid'])).toBe(true);
  });

  test('Relationship: matching deep include', () => {
    expect(checkIncludesPath(['uid.roles'], ['uid', 'roles'])).toBe(true);
  });

  test('Relationship: mismatching deep include', () => {
    expect(checkIncludesPath(['uid'], ['uid', 'user_picture', 'uid'])).toBe(
      false,
    );
  });
});

describe('Check if different type variables are empty', () => {
  test('Arrays are empty', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(['foo'])).toBe(false);
  });

  test('Objects are empty', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ foo: 'bar' })).toBe(false);
  });

  test('Sets are empty', () => {
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Set(['foo']))).toBe(false);
  });

  test('null is empty', () => {
    expect(isEmpty(null)).toBe(true);
  });

  test('undefined is empty', () => {
    expect(isEmpty(undefined)).toBe(true);
  });
});

describe('Remove empty properties from object', () => {
  test('Empty object is returned the same', () => {
    expect(removeEmpty({})).toEqual({});
    expect(removeEmpty({ filter: {} })).toEqual({ filter: {} });
  });

  test('Object with blank property is returned without it', () => {
    expect(removeEmpty({ filter: { drupal_internal__id: '' } })).toEqual({
      filter: {},
    });
  });

  test('Object with non-blank properties are returned with them', () => {
    expect(removeEmpty({ filter: { status: '1' } })).toEqual({
      filter: { status: '1' },
    });

    expect(
      removeEmpty({ filter: { drupal_internal__id: '', status: '1' } }),
    ).toEqual({ filter: { status: '1' } });
  });

  test('Object with sets are removed unchanged', () => {
    expect(
      removeEmpty({ fields: { 'node--article': new Set(['title']) } }),
    ).toEqual({ fields: { 'node--article': new Set(['title']) } });
  });

  test('Object with arrays are removed unchanged', () => {
    expect(removeEmpty({ include: ['uid'] })).toEqual({ include: ['uid'] });
  });
});
