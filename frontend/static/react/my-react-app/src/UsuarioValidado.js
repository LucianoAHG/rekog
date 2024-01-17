import React from 'react';

const UsuarioValidado = ({ resultadoValidacion }) => {
    return (
        <div className="container">
            <h2>Resultado de la Validación</h2>

            {resultadoValidacion.success ? (
                <div>
                    <p>La validación fue exitosa.</p>
                    {/* Aquí puedes mostrar más información sobre el usuario validado */}
                    <p>Nombre: {resultadoValidacion.nombre}</p>
                    <p>Apellido: {resultadoValidacion.apellido}</p>
                    {/* ... otras propiedades del resultado de la validación */}
                </div>
            ) : (
                <div>
                    <p>La validación falló. {resultadoValidacion.error}</p>
                    {/* Puedes proporcionar más información o instrucciones */}
                </div>
            )}
        </div>
    );
};

export default UsuarioValidado;
