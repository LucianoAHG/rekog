import React, { useState } from 'react';
import Camara from './Camara';

const FormularioReko = () => {
    const [cedula, setCedula] = useState(null);
    const [capturaCara, setCapturaCara] = useState(null);

    const handleCedulaChange = (e) => {
        setCedula(e.target.files[0]);
    };

    const handleCapturaTomada = (capturaBase64) => {
        setCapturaCara(capturaBase64);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('cedula', cedula);
            formData.append('captura_cara', dataURItoBlob(capturaCara));

            const response = await fetch('http://127.0.0.1:5000/upload_documentos', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Documentos subidos exitosamente');
            } else {
                console.error('Error al subir documentos');
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
        <div>
            <h2>Formulario de Reconocimiento</h2>
            <div>
                <label htmlFor="cedula">Subir cédula:</label>
                <input type="file" accept="image/*" capture="camera" id="cedula" name="cedula" onChange={handleCedulaChange} />
            </div>
            <div>
                <label>Captura de cara:</label>
                <Camara onCapturaTomada={handleCapturaTomada} />
            </div>
            <button onClick={handleSubmit}>{capturaCara ? 'Enviar Documentos' : 'Tomar Captura'}</button>
        </div>
    );
};

export default FormularioReko;
