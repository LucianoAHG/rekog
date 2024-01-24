//import React, { useRef, useState } from 'react';
//import Webcam from 'react-webcam';
//import io from 'socket.io-client';

//const socket = io('http://localhost:5000'); // Asegúrate de ajustar la URL del servidor

//const Testvideo = () => {
//    const webcamRef = useRef(null);
//    const [isRecording, setIsRecording] = useState(false);

//    const startRecording = () => {
//        setIsRecording(true);

//        const captureFrame = () => {
//            if (webcamRef.current) {
//                const frame = webcamRef.current.getScreenshot();
//                socket.emit('videoFrame', frame);
//            }

//            if (isRecording) {
//                requestAnimationFrame(captureFrame);
//            }
//        };

//        captureFrame();
//    };

//    const stopRecording = () => {
//        setIsRecording(false);
//    };

//    return (
//        <div>
//            <h1>Detector de Cédula de Identidad en Tiempo Real</h1>
//            <Webcam ref={webcamRef} width="640" height="480" />
//            {isRecording ? (
//                <button onClick={stopRecording}>Detener Transmisión</button>
//            ) : (
//                <button onClick={startRecording}>Iniciar Transmisión</button>
//            )}
//        </div>
//    );
//};

//export default Testvideo;
