import React from 'react';

import Editor from 'react-simple-code-editor';
import { highlight } from 'sql-highlight';

import { useLabContext } from '../../contexts/LabContext';
import './SQLEditor.css';

/**
 * Componente que representa um editor de SQL.
 */
function SQLEditor() {

  const {code, setCode} = useLabContext();

  return (
    <Editor
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => {
        return highlight(code, {html:true}); 
      }}
      padding={10}
      style={{
        flex: '2',
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}/>
  );
}

export default SQLEditor