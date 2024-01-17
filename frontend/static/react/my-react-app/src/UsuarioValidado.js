import React from 'react';

const UsuarioValidado = ({ resultadoValidacion }) => {
    return (
        <div className="container">
            <h2>Resultado de la Validaci�n</h2>

            {resultadoValidacion.success ? (
                <div>
                    <p>La validaci�n fue exitosa.</p>
                    {/* Aqu� puedes mostrar m�s informaci�n sobre el usuario validado */}
                    <p>Nombre: {resultadoValidacion.nombre}</p>
                    <p>Apellido: {resultadoValidacion.apellido}</p>
                    {/* ... otras propiedades del resultado de la validaci�n */}
                </div>
            ) : (
                <div>
                    <p>La validaci�n fall�. {resultadoValidacion.error}</p>
                    {/* Puedes proporcionar m�s informaci�n o instrucciones */}
                </div>
            )}
        </div>
    );
};

export default UsuarioValidado;
