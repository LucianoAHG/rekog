import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Camara = ({ onCapturaTomada, activarCamara }) => {
    const webcamRef = useRef(null);
    const [capturaActiva, setCapturaActiva] = useState(false);

    const toggleCaptura = () => {
        if (activarCamara && webcamRef.current) {
            setCapturaActiva(!capturaActiva);
        }
    };

    const tomarCaptura = () => {
        if (webcamRef.current) {
            const capturaBase64 = webcamRef.current.getScreenshot();
            onCapturaTomada(capturaBase64);
            setCapturaActiva(false);
        }
    };

    return (
        <div>
            {activarCamara && (
                <>
                    <Webcam audio={false} height={350} ref={webcamRef} screenshotFormat="image/jpeg" width={350} />
                    <br />
                    <button onClick={capturaActiva ? tomarCaptura : toggleCaptura}>
                        {capturaActiva ? 'Tomar captura' : 'Activar cámara'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Camara;
