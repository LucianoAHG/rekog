import React, { useState, useRef } from 'react';
import Camara from './Camara';
import './formrek.css';

const FormularioReko = () => {
    const [cedula, setCedula] = useState(null);
    const [capturaCara, setCapturaCara] = useState(null);
    const [activarCamara, setActivarCamara] = useState(false);
    const [resultadoValidacion, setResultadoValidacion] = useState(null);
    const [etiquetasCedula, setEtiquetasCedula] = useState([]);
    const [etiquetasCapturaCara, setEtiquetasCapturaCara] = useState([]);

    // Ref para almacenar el temporizador de grabaci�n
    const grabacionRef = useRef(null);

    const handleCedulaChange = (e) => {
        // Validar la extensi�n del archivo
        const file = e.target.files[0];
        if (file && !validateFileExtension(file.name)) {
            alert('La c�dula debe ser un archivo con extensi�n .jpg');
            return;
        }

        setCedula(file);

        // Limpiar las etiquetas cuando se selecciona una nueva c�dula
        setEtiquetasCedula([]);
    };

    const handleCapturaTomada = (capturaBase64) => {
        setCapturaCara(capturaBase64);

        // Limpiar las etiquetas cuando se toma una nueva captura de cara
        setEtiquetasCapturaCara([]);
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

        // Limpiar el temporizador de grabaci�n al desactivar la c�mara
        if (!activarCamara) {
            clearTimeout(grabacionRef.current);
        }
    };

    const handleSubmit = async () => {
        // L�gica para enviar los documentos al backend
        try {
            // Crear un objeto FormData para enviar los archivos al backend
            const formData = new FormData();
            formData.append('cedula', cedula);
            formData.append('video_persona', capturaCara);

            // Realizar la solicitud al backend para subir documentos y realizar la validaci�n
            const response = await fetch('http://localhost:5000/upload_documentos', {
                method: 'POST',
                body: formData,
            });

            // Manejar la respuesta del backend
            const data = await response.json();
            setResultadoValidacion(data.resultado_validacion);

            // Almacenar etiquetas de la c�dula y de la captura de cara en el estado
            if (data.resultado_validacion.labelsData) {
                setEtiquetasCedula(data.resultado_validacion.labelsData.labels_source);
                setEtiquetasCapturaCara(data.resultado_validacion.labelsData.labels_target);
            }
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
                {activarCamara ? 'Desactivar C�mara' : 'Activar C�mara'}
            </button>
            <button onClick={iniciarCapturaVideo}>Iniciar Grabaci�n de Video</button>
            <button onClick={handleSubmit}>Enviar Documentos</button>

            {etiquetasCedula.length > 0 && (
                <div>
                    <h3>Etiquetas detectadas en la c�dula:</h3>
                    <ul>
                        {etiquetasCedula.map((etiqueta, index) => (
                            <li key={index}>{`${etiqueta.name}: ${etiqueta.confidence.toFixed(2)}%`}</li>
                        ))}
                        <li>Cedula de identidad Validada</li>
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
                    <h3>Resultado de Validaci�n</h3>
                    <p>Exito: {resultadoValidacion.success ? 'Si' : 'No, debe intentar nuevamente.'}</p>
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
