import React, { useEffect, useState } from 'react';
import FaceRecognition from './components/FaceRecognition';
import UploadEmployee from './components/UploadEmployee';
// import * as faceapi from 'face-api.js';


const App = () => {


  // const loadModels = async () => {
  //   await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  //   await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  //   await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  // };


  // useEffect(() => {
  //   loadModels();
  // }, []); 


  const [currentMenu, setCurrentMenu] = useState('faceRecognition');

  return (
    <div>
      <h1>Hodimni Yuklash va Yuzni Tanib Olish</h1>
      <button onClick={() => setCurrentMenu('faceRecognition')}>Face Recognition</button>
      <button onClick={() => setCurrentMenu('uploadEmployee')}>Upload Employee</button>

      {currentMenu === 'faceRecognition' ? <FaceRecognition /> : <UploadEmployee />}
    </div>
  );
};

export default App;
