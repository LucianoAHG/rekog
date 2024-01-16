import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './Login';
import CrearUsuario from './CrearUsuario';
import RecuperarContrasena from './RecuperarContrasena';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/CrearUsuario" element={<CrearUsuario />} />
            <Route path="/RecuperarContrasena" element={<RecuperarContrasena />} />
        </Routes>
    );
}

export default App;
