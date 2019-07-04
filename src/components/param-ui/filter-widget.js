import React, { useState, useEffect, useContext } from 'react';

import { LocationContext } from '../../contexts/location';
import { Conditions } from '../../lib/url/filters-juissy';
import ParamSelect from './param-select';
import useFilter from '../../hooks/use-filter';

const FilterCondition = ({ filter, groups }) => {
  const { setFilter } = useContext(LocationContext);
  const { id, expanded } = filter;
  const { condition } = expanded[id];

  const [value, setValue] = useState(condition.value);
  const [operator, setOperator] = useState(condition.operator);
  const [memberOf, setMemberOf] = useState(condition.memberOf);

  const handleChange = e => {
    switch (e.target.name) {
      case 'value':
        setValue(e.target.value);
        break;
      case 'operator':
        setOperator(e.target.value);
        break;
      case 'memberOf':
        setMemberOf(e.target.value);
        break;
    }
  };

  const handleApply = () => {
    setFilter(id, 'update', {
      ...expanded,
      [id]: { condition: { ...condition, operator, value, memberOf } },
    });
  };

  const handleRemove = () => {
    setFilter(id, 'delete');
  };

  useEffect(() => {
    handleApply();
  }, [value, operator, memberOf]);

  return (
    <div className="form_widget">
      <span className="link__title--readable">{condition.path}</span>
      <ParamSelect
        name="operator"
        handleChange={handleChange}
        selected={operator}
      >
        {[...Conditions.unaryOperators].map((unary, index) => (
          <option key={`${id}-operator-${index}`} value={unary}>
            {unary}
          </option>
        ))}
      </ParamSelect>
      <input name="value" type="text" value={value} onChange={handleChange} />
      {groups.length > 0 && (
        <ParamSelect
          name="memberOf"
          handleChange={handleChange}
          selected={memberOf}
        >
          <option value="@root">@root</option>
          {groups.map((groupOption, index) => (
            <option key={`${groupOption.id}-${index}`} value={groupOption.id}>
              {groupOption.id}
            </option>
          ))}
        </ParamSelect>
      )}
    </div>
  );
};

const FilterGroup = ({ filter, groups }) => {
  const { setFilter } = useContext(LocationContext);
  const { id, expanded } = filter;
  const { group } = expanded[id];

  const [memberOf, setMemberOf] = useState(group.memberOf);
  const [conjunction, setConjunction] = useState(group.conjunction);

  const handleChange = e => {
    switch (e.target.name) {
      case 'conjunction':
        setConjunction(e.target.value);
        break;
      case 'memberOf':
        setMemberOf(e.target.value);
        break;
    }
  };

  const handleApply = () => {
    setFilter(id, 'update', {
      ...expanded,
      [id]: { group: { ...group, conjunction } },
    });
  };

  useEffect(() => {
    handleApply();
  }, [conjunction]);

  return (
    <div className="form_widget">
      <span className="link__title--readable">{id} - conjunction: </span>
      <ParamSelect
        name="conjunction"
        handleChange={handleChange}
        selected={conjunction}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </ParamSelect>
      {groups.length > 1 && (
        <ParamSelect
          name="memberOf"
          handleChange={handleChange}
          selected={memberOf}
        >
          <option value="@root">@root</option>
          {groups.map((groupOption, index) => (
            <option key={`${groupOption.id}-${index}`} value={groupOption.id}>
              {groupOption.id}
            </option>
          ))}
        </ParamSelect>
      )}
    </div>
  );
};

const FilterWidget = () => {
  const { filter } = useContext(LocationContext);
  const { conditions, groups } = useFilter(filter);

  if (!conditions || conditions.length === 0) {
    return <div />;
  }

  return (
    <div className="filter_widget">
      {conditions.map((filterCondition, index) => (
        <FilterCondition key={index} filter={filterCondition} groups={groups} />
      ))}
      {groups.map((filterGroup, index) => (
        <FilterGroup key={index} filter={filterGroup} groups={groups} />
      ))}
    </div>
  );
};

export default FilterWidget;
