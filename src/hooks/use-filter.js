import React, { useEffect, useReducer } from 'react';
import { expandFilter } from '../lib/url/filter';

const load = filter =>
  Object.entries(filter).map(([id, value]) => ({
    id,
    expanded: expandFilter({ [id]: value }),
  }));

const reducer = (state, action) => {
  switch (action.type) {
    case 'refresh':
      return load(action.value);
      break;
  }
};

const useFilter = filter => {
  const [filters, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: 'refresh', value: filter });
  }, [filter]);

  const separated = filters.reduce(
    (acc, cur) => {
      const { id, expanded } = cur;

      if (expanded[id].hasOwnProperty('condition')) {
        acc.conditions.push(cur);
      } else if (expanded[id].hasOwnProperty('group')) {
        acc.groups.push(cur);
      }

      return acc;
    },
    { conditions: [], groups: [] },
  );

  return separated;
};

export default useFilter;
