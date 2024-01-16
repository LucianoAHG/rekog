import React, { useState } from 'react';
import axios from 'axios';

function CrearUsuario() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/crear_usuario', {
                nombre: nombre,
                apellido: apellido,
                email: email,
                telefono: telefono,
                nueva_password: nuevaPassword,
                confirmar_contrasena: confirmarContrasena,
            });

            console.log(response.data); // Maneja la respuesta según tus necesidades

        } catch (error) {
            console.error('Error al crear usuario:', error.response.data);
            setError(error.response.data.error || 'Error al crear usuario');
        }
    };

    return (
        <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl">Crear Nuevo Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="apellido" className="block text-gray-700 text-sm font-bold mb-2">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telefono" className="block text-gray-700 text-sm font-bold mb-2">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nueva_password" className="block text-gray-700 text-sm font-bold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="nueva_password"
                            name="nueva_password"
                            autoComplete="current-password"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmar_contrasena" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmar_contrasena"
                            name="confirmar_contrasena"
                            autoComplete="current-password"
                            className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                        Crear Usuario
                    </button>
                </form>
                {error && <p className="mt-3 text-center text-red-500">{error}</p>}
            </div>
        </div>
    );
}

export default CrearUsuario;
