import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as posenet from '@tensorflow-models/posenet';

const GestureRecognition = () => {
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const runPoseNet = async () => {
            try {
                await tf.setBackend('webgl');

                const net = await posenet.load();
                console.log('PoseNet model loaded successfully:', net);

                const video = videoRef.current;

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    video.srcObject = stream;

                    await new Promise((resolve) => {
                        video.onloadedmetadata = () => {
                            resolve();
                            video.play();
                        };
                    });

                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');

                    video.onresize = () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                    };

                    detectPoseInRealTime(net, video, context);
                } catch (error) {
                    console.error('Error accessing or initializing camera:', error);
                }
            } catch (error) {
                console.error('Error loading PoseNet model:', error);
            }
        };

        runPoseNet();
    }, []);

    const detectPoseInRealTime = async (net, video, context) => {
        try {
            const detectPose = async () => {
                try {
                    const { keypoints } = await net.estimateSinglePose(video);

                    context.clearRect(0, 0, video.width, video.height);

                    keypoints.forEach((keypoint) => {
                        const { x, y } = keypoint.position;

                        // Dibujar círculo rojo en cada punto clave
                        context.beginPath();
                        context.arc(x, y, 5, 0, 2 * Math.PI);
                        context.fillStyle = 'red';
                        context.fill();

                        // Dibujar líneas para conectar los puntos clave (opcional)
                        keypoints.forEach((connectedKeypoint) => {
                            const { x: connectedX, y: connectedY } = connectedKeypoint.position;
                            context.beginPath();
                            context.moveTo(x, y);
                            context.lineTo(connectedX, connectedY);
                            context.strokeStyle = 'blue';
                            context.stroke();
                        });
                    });
                } catch (error) {
                    console.error('Error detecting pose:', error);
                }

                requestAnimationFrame(detectPose);
            };

            detectPose();
        } catch (error) {
            console.error('Error detecting pose in real-time:', error);
        }
    };

    return (
        <div>
            <video
                ref={videoRef}
                style={{ transform: 'scaleX(-1)', width: '640px', height: '480px' }}
                autoPlay
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                width={640}
                height={480}
            />
        </div>
    );
};

export default GestureRecognition;
