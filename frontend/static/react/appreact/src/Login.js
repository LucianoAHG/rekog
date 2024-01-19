import React, { useState } from 'react';
import './index.css';

function Button({ value, onClick }) {
    return (
        <button
            onClick={onClick}
            className="mt-6 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
            {value}
        </button>
    );
}

function Input({ type, id, name, label, placeholder, value, onChange, autofocus }) {
    return (
        <label className="text-gray-500 block mt-3">
            {label}
            <input
                autoFocus={autofocus}
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"
            />
        </label>
    );
}

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // Manejar la respuesta del servidor
            if (data.success) {
                setMessage('Inicio de sesión exitoso');
            } else {
                setMessage('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error durante el inicio:', error);
            setMessage('Error durante el inicio de sesión');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl">Iniciar sesión</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="text" id="email" name="email" label="Usuario o Correo electrónico" placeholder="me@example.com" value={formData.email} onChange={handleInputChange} autofocus={true} />
                    <Input type="password" id="password" name="password" label="Contraseña" placeholder="**********" value={formData.password} onChange={handleInputChange} />
                    <Button value="Ingresar" />
                </form>
                <p className="mt-4 text-center text-gray-500">{message}</p>
                <p className="mt-4 text-center text-gray-500">
                    <a href="/recuperar">¿Olvidó su contraseña?</a>
                    <a href="/CrearUsuario">Nuevo usuario</a>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
