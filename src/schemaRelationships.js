import React from 'react';

import Relationship from './relationship';

const SchemaRelationships = ({ relationships, type }) => (
  relationships.length > 0
    ? <div>
      <h3>Relationships</h3>
      <ul>
        {relationships.map((relationship, index) => (
          <li key={`schema-relationship-${index}`}>
            <Relationship relationship={relationship} type={type} />
          </li>
        ))}
      </ul>
    </div>
    : <div></div>
);


export default SchemaRelationships;
