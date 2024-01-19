import React, { useRef } from 'react';

const Camara = ({ onCapturaTomada, activarCamara, onVideoGrabado }) => {
    const videoRef = useRef();

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
            };

            mediaRecorder.start();

            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000);
        } catch (error) {
            console.error('Error al iniciar la grabación:', error);
        }
    };

    return (
        <div>
            {activarCamara && (
                <>
                    <video ref={videoRef} autoPlay playsInline muted />
                    <button onClick={comenzarGrabacion}>Grabar</button>
                </>
            )}
        </div>
    );
};

export default Camara;
