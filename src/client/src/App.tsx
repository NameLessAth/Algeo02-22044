import React from 'react';
import './App.css';
import UploadImage from './components/UploadImage';
import UploadFolder from './components/UploadFolder';

function App() {
  return (
    <div className="App">
      <UploadImage />
      <br />
      <UploadFolder />
    </div>
  );
}

export default App;
