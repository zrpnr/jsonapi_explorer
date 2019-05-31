import React, { useState, useEffect } from 'react';

import { Link, LinkElement } from './link';
import Resource from './resource';
import { request } from './lib/request';

const url = process.env.TOP_LEVEL;

const App = () => {
  const [baseUrl, setBaseUrl] = useState(url);
  const [result, setResult] = useState([]);
  const [links, setLinks] = useState([]);
  const [resourceLinks, setResourceLinks] = useState([]);

  const loadTopLevel = () => {
    const fetchDocument = async (url) => {
      const response = await request(url);

      setBaseUrl(url);
      setResourceLinks(Link.parseLinks(response.links));
    };

    fetchDocument(baseUrl);
  };

  const updateDocument = (toUrl) => {

    const updateBaseUrl = async (url) => {
      const response = await request(url);

      setBaseUrl(url);
      setLinks(Link.parseLinks(response.links));
      setResult(response);
    };

    updateBaseUrl(toUrl);
  };

  useEffect(() => {
    loadTopLevel();
  }, []);

  return (
    <div className="container">
      <header className="location-header">
        <div className="pane location">
          <h2>Location</h2>
          <div className="scrollable scrollable_x location-url">{baseUrl}</div>
        </div>
      </header>
      <nav className="pane resourceLinks">
        <h2>Resources</h2>
        <ul className="scrollable scrollable_y">
          {Object.keys(resourceLinks).map((key, index) => (
              <li key={`resource-link-${index}`}>
                <LinkElement link={resourceLinks[key]} handleClick={updateDocument} />
              </li>
          ))}
        </ul>
      </nav>
      <Resource
        result={result}
        links={links}
        updateDocument={updateDocument}
      />
    </div>
  );
};

export default App;
