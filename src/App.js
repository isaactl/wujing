import React from 'react';
import logo from './logo.svg';
import './App.css';
import DiffEditor from './components/diff/editor'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <DiffEditor open={true}/>
      </header>
    </div>
  );
}

export default App;
