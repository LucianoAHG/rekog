import React from 'react';

const UsuarioValidado = ({ resultadoValidacion }) => {
    const { success, message, similarityPercentage } = resultadoValidacion;

    return (
        <div className="usuario-validado-container">
            {success ? (
                <div>
                    <h3>Validaci�n Exitosa</h3>
                    <p>{message}</p>
                    <p>Porcentaje de similitud: {similarityPercentage}%</p>
                </div>
            ) : (
                <div>
                    <h3>Error de Validaci�n</h3>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default UsuarioValidado;
