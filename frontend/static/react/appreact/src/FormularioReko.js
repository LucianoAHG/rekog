import React, { useState, useRef } from 'react';
import Camara from './Camara';
import './formrek.css';

const FormularioReko = () => {
    const [capturaCedula, setCapturaCedula] = useState(null);
    const [capturaCara, setCapturaCara] = useState(null);
    const [activarCamara, setActivarCamara] = useState(false);
    const [resultadoValidacion, setResultadoValidacion] = useState(null);
    const [etiquetasCedula, setEtiquetasCedula] = useState([]);
    const [etiquetasCapturaCara, setEtiquetasCapturaCara] = useState([]);
    const grabacionRef = useRef(null);

    const handleCapturaTomada = (capturaBase64, tipo) => {
        if (tipo === 'cedula') {
            setCapturaCedula(capturaBase64);
        } else {
            setCapturaCara(capturaBase64);
        }

        setEtiquetasCedula([]);
        setEtiquetasCapturaCara([]);
    };

    const handleVideoGrabado = (videoBlob, tipo) => {
        if (tipo === 'cedula') {
            setCapturaCedula(videoBlob);
        } else {
            setCapturaCara(videoBlob);
        }
    };

    const iniciarCapturaVideo = () => {
        setCapturaCedula(null);
        setCapturaCara(null);
        grabacionRef.current = setTimeout(detenerCapturaVideo, 5000);
    };

    const detenerCapturaVideo = () => {
        setCapturaCedula(null);
        setCapturaCara(null);
        clearTimeout(grabacionRef.current);
    };

    const toggleActivarCamara = () => {
        setActivarCamara(!activarCamara);

        if (!activarCamara) {
            clearTimeout(grabacionRef.current);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('video_cedula', capturaCedula);
            formData.append('video_persona', capturaCara);

            const response = await fetch('http://localhost:5000/upload_documentos', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setResultadoValidacion(data.resultado_validacion);

            if (data.resultado_validacion.labelsDataCedula) {
                setEtiquetasCedula(data.resultado_validacion.labelsDataCedula);
            }

            if (data.resultado_validacion.labelsDataPersona) {
                setEtiquetasCapturaCara(data.resultado_validacion.labelsDataPersona);
            }
        } catch (error) {
            console.error('Error al enviar videos al backend:', error);
        }
    };

    return (
        <div id="ContenedorPrincipal" className="container">
            <div id="Titulo">
                <h2>Formulario de Reconocimiento</h2>
            </div>

            <div id="formulario" className="form-section">
                <label>Captura de video (Cédula):</label>
                <div id="capturacedula" className="label-container">
                    <Camara
                        onCapturaTomada={(capturaBase64) => handleCapturaTomada(capturaBase64, 'cedula')}
                        activarCamara={activarCamara}
                        onVideoGrabado={(videoBlob) => handleVideoGrabado(videoBlob, 'cedula')}
                    />
                </div>

                <label>Captura de video (Persona):</label>
                <div id="capturavideo" className="label-container">
                    <Camara
                        onCapturaTomada={(capturaBase64) => handleCapturaTomada(capturaBase64, 'persona')}
                        activarCamara={activarCamara}
                        onVideoGrabado={(videoBlob) => handleVideoGrabado(videoBlob, 'persona')}
                    />
                </div>
            </div>

            <button onClick={toggleActivarCamara}>
                {activarCamara ? 'Desactivar Cámara' : 'Activar Cámara'}
            </button>
            <button onClick={iniciarCapturaVideo}>Iniciar Grabación de Video</button>
            <button onClick={handleSubmit}>Enviar Videos</button>

            {etiquetasCedula.length > 0 && (
                <div>
                    <h3>Etiquetas detectadas en la cédula:</h3>
                    <ul>
                        {etiquetasCedula.map((etiqueta, index) => (
                            <li key={index}>{`${etiqueta.name}: ${etiqueta.confidence.toFixed(2)}%`}</li>
                        ))}
                    </ul>
                </div>
            )}

            {etiquetasCapturaCara.length > 0 && (
                <div>
                    <h3>Etiquetas detectadas en la captura de cara:</h3>
                    <ul>
                        {etiquetasCapturaCara.map((etiqueta, index) => (
                            <li key={index}>{`${etiqueta.name}: ${etiqueta.confidence.toFixed(2)}%`}</li>
                        ))}
                    </ul>
                </div>
            )}

            {resultadoValidacion && (
                <div>
                    <h3>Resultado de Validacion</h3>
                    <p>exito: {resultadoValidacion.success ? 'Sí' : 'No, debe intentar nuevamente.'}</p>
                    <p>Mensaje: {resultadoValidacion.message}</p>
                    {resultadoValidacion.success && (
                        <>
                            <p>Porcentaje de similitud: {resultadoValidacion.similarityPercentage}%</p>
                            {resultadoValidacion.matchMessage && <p>{resultadoValidacion.matchMessage}</p>}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormularioReko;
