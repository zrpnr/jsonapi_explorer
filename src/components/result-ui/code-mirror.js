import React, { useEffect, useState } from 'react';

import CodeMirrorEditor from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/scroll/simplescrollbars';

const CodeMirror = ({ code, options = {}}) => {
  const [codeElem, setCodeElem] = useState(null);
  const [codeMirror, setCodeMirror] = useState(null);

  useEffect(() => {
    if (codeElem) {
      if (!codeMirror) {
        const codeMirror = CodeMirrorEditor(codeElem, Object.assign({
          value: code,
          mode: 'application/ld+json',
          readOnly: true,
          lineWrapping: false,
          lineNumbers: true,
          foldGutter: true,
          autoRefresh: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          scrollbarStyle: 'simple',
        }, options));
        setCodeMirror(codeMirror);
      } else {
        codeMirror.setValue(code);
      }
    }
  }, [codeElem, code]);

  return <div ref={setCodeElem} className="results__raw flex-height" />;
};

export default CodeMirror;
