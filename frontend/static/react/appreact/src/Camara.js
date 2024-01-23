import React, { useRef, useState } from 'react';

const Camara = ({ onCapturaTomada, activarCamara, onVideoGrabado, duracionGrabacion = 5000 }) => {
    const videoRef = useRef();
    const [grabacionIniciada, setGrabacionIniciada] = useState(false);

    const comenzarGrabacion = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blobVideo = new Blob(chunks, { type: 'video/mp4' });
                onVideoGrabado(blobVideo);

                // Restablecer el stream
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = newStream;
                setGrabacionIniciada(false); // Desactivar la cámara después de la grabación
            };

            mediaRecorder.start();
            setGrabacionIniciada(true);

            // Puedes ajustar el tiempo de grabación según tus necesidades
            setTimeout(() => {
                mediaRecorder.stop();
            }, duracionGrabacion);
        } catch (error) {
            console.error('Error al iniciar la grabación:', error);
        }
    };

    return (
        <div>
            {activarCamara && (
                <>
                    <video ref={videoRef} autoPlay playsInline muted />
                    <button onClick={comenzarGrabacion} disabled={grabacionIniciada}>
                        {grabacionIniciada ? 'Grabando...' : 'Grabar'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Camara;
