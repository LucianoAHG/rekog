import React, { useState } from 'react';
import Camara from './Camara';
import UsuarioValidado from './UsuarioValidado';
import './formrek.css';

const FormularioReko = () => {
    const [cedula, setCedula] = useState(null);
    const [capturaCara, setCapturaCara] = useState(null);
    const [activarCamara, setActivarCamara] = useState(false);
    const [resultadoValidacion, setResultadoValidacion] = useState(null);

    const handleCedulaChange = (e) => {
        setCedula(e.target.files[0]);
    };

    const handleCapturaTomada = (capturaBase64) => {
        setCapturaCara(capturaBase64);
    };

    const toggleActivarCamara = () => {
        setActivarCamara(!activarCamara);
    };

    const handleSubmit = async () => {
        try {
            if (capturaCara) {
                const formData = new FormData();
                formData.append('cedula', cedula);
                formData.append('captura_cara', dataURItoBlob(capturaCara));

                const response = await fetch('http://127.0.0.1:5000/upload_documentos', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Documentos subidos exitosamente');

                    // Supongamos que el backend responde con un objeto resultadoValidacion
                    const data = await response.json();
                    setResultadoValidacion(data.resultadoValidacion);
                } else {
                    console.error('Error al subir documentos');
                }
            } else {
                console.error('Por favor, tome una captura de la cara.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    };

    return (
        <div className="container">
            <h2>Formulario de Reconocimiento</h2>
            <div className="form-section">
                <div className="label-container">
                    <label htmlFor="cedula">Subir cédula:</label>
                    <input type="file" accept="image/*" capture="camera" id="cedula" name="cedula" onChange={handleCedulaChange} />
                </div>
                <div className="label-container">
                    <label>Captura de cara:</label>
                    <Camara onCapturaTomada={handleCapturaTomada} activarCamara={activarCamara} />
                </div>
            </div>
            <button onClick={toggleActivarCamara}>{activarCamara ? 'Desactivar Cámara' : 'Activar Cámara'}</button>
            {activarCamara && <button onClick={handleSubmit}>Enviar Documentos</button>}

            {/* Renderizar UsuarioValidado si hay resultados de la validación */}
            {resultadoValidacion && <UsuarioValidado resultadoValidacion={resultadoValidacion} />}
        </div>
    );
};

export default FormularioReko;
