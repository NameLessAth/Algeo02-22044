import React from 'react';
import './App.css';
import Title from './components/Title';
import WhiteBar from './components/WhiteBar';
import UploadPage from './components/UploadPage';

function App() {
  return (
    <div className="App bg-nblack m-0 p-0 max-w-[100vw] h-full">
      <Title />
      <br />
      <WhiteBar />
      <br />
      <UploadPage />
      <br />
    </div>
  );
}

export default App;
