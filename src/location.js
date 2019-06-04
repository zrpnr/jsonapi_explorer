import React, { createContext, useState, useEffect } from 'react';
import { extract, toggleSetEntry, clearSetEntry } from "./utils";

import { request } from './lib/request';

const parseJsonApiUrl = (fromUrl) => {
    const url = new URL(fromUrl);
    const query = url.searchParams;
    return {
        protocol: url.protocol,
        host: url.host,
        port: url.port,
        path: url.pathname,
        query: {
            filter: query.get('filter'),
            include: query.get('include')||[],
            fields: query.get('fields')||{},
            sort: query.get('sort')||[],
        },
        fragment: url.hash,
    }
};

const compileJsonApiUrl = ({protocol, host, port, path, query, fragment}) => {
    const queryString = ['include', 'fields', 'sort']
        .filter(name => query[name] && !Array.isArray(query[name]) || query[name].length)
        .map(name => {
          return name === 'fields'
            ? Object.keys(query[name]).map(type => `fields[${type}]=${[...query.fields[type]].join(',')}`)
            : `${name}=${query[name].join(',')}`;
        })
        .join('&');
    return `${protocol}//${host}${port.length ? ':' + port : ''}${path}${fragment.length ? '#' + fragment : ''}${queryString.length ? '?' + queryString : ''}`
};

const LocationContext = createContext({});

const Location = ({homeUrl, children}) => {
    // Set the location state to a parsed url and a compiled url.
    const [ parsedUrl, setParsedUrl ] = useState(parseJsonApiUrl(homeUrl));
    const [ locationUrl, setLocationUrl ] = useState(compileJsonApiUrl(parsedUrl));
    const [ resources, setResources ] = useState(new Set());
    const [ document, setDocument ] = useState({});

    // Takes a single query parameter and updates the parsed url.
    const updateQuery = (param) => setParsedUrl(Object.assign({}, parsedUrl, {query: Object.assign({}, parsedUrl.query, param)}));

    // If the parsed url is updated, compile it and update the location url.
    useEffect(() => setLocationUrl(compileJsonApiUrl(parsedUrl)), [parsedUrl]);
    useEffect(() => {
      request(locationUrl).then(setDocument);
    }, [locationUrl]);

    // Extract and surface useful url components in the location context as
    // readable values.
    const {filter, fields, include, sort} = parsedUrl.query;
    const {fragment} = parsedUrl;

    return <LocationContext.Provider
        value={{
            parsedUrl,
            locationUrl,
            resources,
            document,
            filter,
            fields,
            include,
            sort,
            fragment,
            onEntryPoint: extract(document, 'links.self.href') === homeUrl,
            setUrl: (newLocation) => {
              setParsedUrl(parseJsonApiUrl(newLocation.href));
              setResources(clearSetEntry(resources, newLocation.type));
            },
            setFilter: (newParam) => updateQuery({filter: newParam}),
            toggleField: (type, field) => {
              const fieldSet = extract(parsedUrl, `query.fields.${type}`, new Set());
              toggleSetEntry(fieldSet, field);
              const newParam = Object.assign({}, parsedUrl.fields||{}, {[type]: fieldSet});
              updateQuery({fields: newParam})
            },
            clearFieldSet: (type) => {
              const newFieldsParam = parsedUrl.query.fields;
              delete(newFieldsParam[type]);
              updateQuery({fields: newFieldsParam})
            },
            setInclude: (newParam) => updateQuery({include: newParam}),
            setSort: (newParam) => updateQuery({sort: newParam}),
            setFragment: (fragment) => setParsedUrl(Object.assign({}, parsedUrl, {fragment})),
        }}>
        {children}
    </LocationContext.Provider>;
};

export { Location, LocationContext };
