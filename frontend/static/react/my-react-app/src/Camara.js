import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Camara = ({ onCapturaTomada }) => {
    const webcamRef = useRef(null);
    const [capturaActiva, setCapturaActiva] = useState(false);

    const toggleCaptura = () => {
        if (capturaActiva) {
            // Tomar captura y cambiar al estado de espera
            if (webcamRef.current) {
                const capturaBase64 = webcamRef.current.getScreenshot();
                onCapturaTomada(capturaBase64);
                setCapturaActiva(false);
            }
        } else {
            // Activar la captura
            setCapturaActiva(true);
        }
    };

    return (
        <div>
            <Webcam audio={false} height={350} ref={webcamRef} screenshotFormat="image/jpeg" width={350} />
            <br />
            <button onClick={toggleCaptura}>{capturaActiva ? 'Tomar captura' : 'Activar cámara'}</button>
        </div>
    );
};

export default Camara;
