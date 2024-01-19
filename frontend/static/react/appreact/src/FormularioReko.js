import React, { useState, useRef } from 'react';
import Camara from './Camara';
import './formrek.css';

const FormularioReko = () => {
    const [cedula, setCedula] = useState(null);
    const [capturaCara, setCapturaCara] = useState(null);
    const [activarCamara, setActivarCamara] = useState(false);
    const [resultadoValidacion, setResultadoValidacion] = useState(null);

    // Ref para almacenar el temporizador de grabación
    const grabacionRef = useRef(null);

    const handleCedulaChange = (e) => {
        // Validar la extensión del archivo
        const file = e.target.files[0];
        if (file && !validateFileExtension(file.name)) {
            alert('La cédula debe ser un archivo con extensión .jpg');
            return;
        }

        setCedula(file);
    };

    const handleCapturaTomada = (capturaBase64) => {
        setCapturaCara(capturaBase64);
    };

    const handleVideoGrabado = (videoBlob) => {
        setCapturaCara(videoBlob);
    };

    const iniciarCapturaVideo = () => {
        // Iniciar la captura de video
        setCapturaCara(null);  // Limpiar cualquier captura existente
        grabacionRef.current = setTimeout(detenerCapturaVideo, 5000);
    };

    const detenerCapturaVideo = () => {
        // Detener la captura de video
        setCapturaCara(null);  // Limpiar cualquier captura existente
        clearTimeout(grabacionRef.current);
    };

    const toggleActivarCamara = () => {
        setActivarCamara(!activarCamara);

        // Limpiar el temporizador de grabación al desactivar la cámara
        if (!activarCamara) {
            clearTimeout(grabacionRef.current);
        }
    };

    const handleSubmit = async () => {
        // Lógica para enviar los documentos al backend
        try {
            // Crear un objeto FormData para enviar los archivos al backend
            const formData = new FormData();
            formData.append('cedula', cedula);
            formData.append('video_persona', capturaCara);

            // Realizar la solicitud al backend para subir documentos y realizar la validación
            const response = await fetch('http://localhost:5000/upload_documentos', {
                method: 'POST',
                body: formData,
            });

            // Manejar la respuesta del backend
            const data = await response.json();
            setResultadoValidacion(data.resultado_validacion);
        } catch (error) {
            console.error('Error al enviar documentos al backend:', error);
        }
    };

    const validateFileExtension = (fileName) => {
        const allowedExtensions = ['.jpg'];
        const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
        return allowedExtensions.includes('.' + fileExtension.toLowerCase());
    };

    return (
        <div id="ContenedorPrincipal" className="container">
            <div id="Titulo">
                <h2>Formulario de Reconocimiento</h2>
            </div>

            <div id="formulario" className="form-section">
                <div id="contenedor" className="label-container">
                    <div>
                        <div id="contenedorcedula">
                            <label id="titulocedula" htmlFor="cedula">
                                Subir cedula:
                            </label>
                        </div>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            id="cedula"
                            name="cedula"
                            onChange={handleCedulaChange}
                        />
                    </div>
                </div>

                <label>Captura de video:</label>

                <div id="capturavideo" className="label-container">
                    <Camara
                        onCapturaTomada={handleCapturaTomada}
                        activarCamara={activarCamara}
                        onVideoGrabado={handleVideoGrabado}
                    />
                </div>
            </div>

            <button onClick={toggleActivarCamara}>
                {activarCamara ? 'Desactivar Cámara' : 'Activar Cámara'}
            </button>
            <button onClick={iniciarCapturaVideo}>Iniciar Grabación de Video</button>
            <button onClick={handleSubmit}>Enviar Documentos</button>

            {resultadoValidacion && (
                <div>
                    <h3>Resultado de Validación</h3>
                    <p>Éxito: {resultadoValidacion.success ? 'Sí' : 'No'}</p>
                    <p>Mensaje: {resultadoValidacion.message}</p>
                    <p>Porcentaje de similitud: {resultadoValidacion.similarityPercentage}%</p>
                    <p>{resultadoValidacion.matchMessage}</p>
                </div>
            )}
        </div>
    );
};

export default FormularioReko;
