import React, { useState, useEffect, useContext } from 'react';

import SchemaAttributes from './schemaAttributes';
import SchemaRelationships from './schemaRelationships';

import { getAttributes, getRelationships, getResourceRef } from './lib/normalize';
import { request } from './lib/request';
import { extract, hasSetEntry } from './utils';
import { LocationContext } from './location';

const Schema = ({ url, level = 'top' }) => {

  const [type, setType] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const {include, toggleInclude } = useContext(LocationContext);

  useEffect(() => {

    const fetchDocument = async (url) => {
      const result = await request(url);

      if (result.hasOwnProperty('definitions')) {
        const $ref = getResourceRef(result);

        if ($ref) {
          const meta = await request($ref);

          setType(extract(meta, 'definitions.type.const', ''));
          setAttributes(getAttributes(meta));
          setRelationships(getRelationships(meta));
        }
      }
    };

    if (url && url !== '') {
      fetchDocument(url);
    }

  }, [url]);

  return (
    <div className="schema-list">
      {level !== 'top' &&
        <div className="schema--type">
          <input
            type="checkbox"
            checked={include.indexOf(type) > -1}
            onChange={() => toggleInclude(type)}
          />
          include {type}
        </div>
      }
      <SchemaAttributes attributes={attributes} type={type} />
      <SchemaRelationships relationships={relationships} type={type} />
    </div>
  )
};

export default Schema;
