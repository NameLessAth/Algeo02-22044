import React from 'react';
import './App.css';
import Title from './components/Title';
import UploadImage from './components/UploadImage';
import UploadFolder from './components/UploadFolder';
import WhiteBar from './components/WhiteBar';

function App() {
  return (
    <div className="App bg-nblack m-0 p-0 max-w-[100vw] h-full">
      <Title />
      <br />
      <WhiteBar />
      <br />
      <UploadImage />
      <br />
      <WhiteBar />
      <br />
      <UploadFolder />
    </div>
  );
}

export default App;
