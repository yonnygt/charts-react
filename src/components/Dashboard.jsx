// src/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ui/ThemeContext'; // Importa el hook useTheme
import KeyIcon from '@heroicons/react/24/outline/KeyIcon';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import InboxStackIcon from '@heroicons/react/24/outline/InboxStackIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftOnRectangleIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import logo from '../../src/assets/logo-lasplumas.png';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, changeTheme } = useTheme(); // Usa el hook useTheme para acceder al tema y la función para cambiarlo

  const [configMenuOpen, setConfigMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/inventory':
        return 'Inventario';
      case '/analytics':
        return 'Análisis';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" data-theme={theme}>
      <div className={`fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 lg:static lg:w-64 transition-transform transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} data-theme={theme}>
        <div className="flex flex-col gap-2 h-full">
          <div className="flex h-[60px] items-center px-6">
            <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
              <img className="w-full h-12 mr-2" src={logo} alt="Logo Las Plumas" />
            </NavLink>
          </div>
          <div className="flex-1 ">
            <nav className="grid items-start px-1 gap-1 text-sm font-medium">
              <NavLink to="/dashboard" className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-500'} data-theme={theme}`}>
                <Squares2X2Icon className="h-6 w-6" />
                Dashboard
              </NavLink>
              <NavLink to="/inventory" className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-500'} data-theme={theme}`}>
                <InboxStackIcon className="h-6 w-6" />
                Inventario
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50' : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-500'} data-theme={theme}`}>
                <ChartBarIcon className="h-6 w-6" />
                Análisis
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 bg-base-100/40 px-6 shadow-lg sticky top-0" data-theme={theme}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Bars3Icon className="h-6 w-6 text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg dark:text-gray-50">{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={changeTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {theme === 'light' ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-gray-500" />}
            </button>
            <div className="relative">
              <button onClick={() => setConfigMenuOpen(!configMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <CogIcon className="h-6 w-6 text-gray-500" />
              </button>
              {configMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-950">
                  <ul className="py-1">
                    <li>
                      <button onClick={() => navigate('/config')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                        Configuración
                      </button>
                    </li>
                    <li>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                        Cerrar sesión
                        <ArrowRightOnRectangleIcon className="h-5 w-5 inline ml-2" />
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6" data-theme={theme}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
