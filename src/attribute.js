import React, { useContext } from 'react';
import { LocationContext } from './location';
import { hasSetEntry } from './utils';

const Attribute = ({ attribute, type }) => {
  const { resources, fields, toggleField } = useContext(LocationContext);

  return (
    <div className="attribute">
      <input
        type="checkbox"
        checked={
          fields.hasOwnProperty(type) && hasSetEntry(fields[type], attribute.name)
        }
        onChange={() => toggleField(type, attribute.name)}
        disabled={!resources.has(type)}
      />
      {attribute.name}
    </div>
  );
}

export default Attribute;
