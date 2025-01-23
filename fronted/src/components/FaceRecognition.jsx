// src/components/FaceRecognition.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [name, setName] = useState(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
//       await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//       await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//     };

    // const startVideo = () => {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then((stream) => {
    //       videoRef.current.srcObject = stream;
    //     })
    //     .catch((err) => console.error(err));
    // };

//     loadModels().then(startVideo);
//   }, []);

  const handleDetect = async () => {
    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      const response = await fetch('http://localhost:5000/api/staff/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedding: Array.from(detections.descriptor) }),
      });

      const result = await response.json();
      if (result.name === 'Noma’lum') {
        alert('Noma’lum hodim');
      } else {
        setName(`${result.name} (${result.position})`);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <button onClick={handleDetect}>Yuzni aniqlash</button>
      {name && <h3>{name}</h3>}
    </div>
  );
};

export default FaceRecognition;
