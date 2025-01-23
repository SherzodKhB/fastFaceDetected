// src/components/FaceRecognition.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
// import * as tf from '@tensorflow/tfjs-core';


// if (!tf.findBackend('webgl')) {
//     tf.registerBackend('webgl', tf.findBackendFactory('webgl'));
//   }
  
//   if (!tf.findBackend('cpu')) {
//     tf.registerBackend('cpu', tf.findBackendFactory('cpu'));
//   }

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error(err));
    };

    const detectFace = async () => {
      if (!videoRef.current) return;

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
          setName('Noma’lum hodim');
        } else {
          setName(`${result.name} (${result.position})`);
        }
      } else {
        setName(null); // Agar yuz topilmasa
      }
    };

    const setupDetection = () => {
      setInterval(() => {
        detectFace();
      }, 1000); // Har 2 soniyada yuzni aniqlash
    };

   
    startVideo();
    setupDetection();
    
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      {name && <h3>{name}</h3>}
    </div>
  );
};

export default FaceRecognition;
