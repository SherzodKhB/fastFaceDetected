import React, { useEffect, useState } from 'react';
import FaceRecognition from './components/FaceRecognition';
import UploadEmployee from './components/UploadEmployee';
import * as faceapi from 'face-api.js';


const App = () => {

  
  const url = "http://localhost:5000/models"


  const loadModels = async () => {

    
    await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
    await faceapi.nets.faceLandmark68Net.loadFromUri(url);
    await faceapi.nets.faceRecognitionNet.loadFromUri(url);
  };


  useEffect(() => {
    loadModels();
  }, []); 


  const [currentMenu, setCurrentMenu] = useState('faceRecognition');

  return (
    <div>
      <h1>Hodimni Yuklash va Yuzni Tanib Olish. Shu yerdan hodim rasmi ro'yhatda o'tadi</h1>
      <h1> Shu yerdan hodim rasmi ro'yhatdan o'tadi</h1>
      <button onClick={() => setCurrentMenu('faceRecognition')}>Face Recognition</button>
      <button onClick={() => setCurrentMenu('uploadEmployee')}>Upload Employee</button>

      {currentMenu === 'faceRecognition' ? <FaceRecognition /> : <UploadEmployee />}
    </div>
  );
};

export default App;
