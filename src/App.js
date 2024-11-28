import React from 'react';
import './App.css';
import DiffEditor from './components/diff/editor';

function App() {
  return (
    <div className="App">
      <DiffEditor open={true} />
    </div>
  );
}

export default App;
