import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './Login';
import CrearUsuario from './CrearUsuario';
import RecuperarContrasena from './RecuperarContrasena';
import FormularioReko from './FormularioReko';
import UsuarioValidado from './UsuarioValidado';
function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/CrearUsuario" element={<CrearUsuario />} />
            <Route path="/RecuperarContrasena" element={<RecuperarContrasena />} />
            <Route path="/FormularioReko" element={<FormularioReko />} />
            <Route path="/UsuarioValidado" element={<UsuarioValidado />} />
        </Routes>
    );
}

export default App;