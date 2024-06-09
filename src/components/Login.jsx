// src/components/Login.jsx
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import fondo from './logo.jfif'; // Asegúrate de que la ruta sea correcta.
import axios from 'axios';

export default function Login() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);

  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <section className="bg-cover bg-center min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow dark:border sm:max-w-md w-full mx-4 sm:mx-auto dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Inicia Sesión</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Usuario</Label>
            <Input
              id="email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Usuario"
              className={`${emailError ? "border-red-500" : ""}`}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div>
            <Label htmlFor="password">Clave</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={`${passwordError ? "border-red-500" : ""}`}
            />
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className=" w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              />
              <Label htmlFor="remember" className="pl-1 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Recuérdame
              </Label>
            </div>
            <Link to="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button type="submit" className="w-full text-white bg-success hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
            Iniciar Sesión
          </Button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Regístrate</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
