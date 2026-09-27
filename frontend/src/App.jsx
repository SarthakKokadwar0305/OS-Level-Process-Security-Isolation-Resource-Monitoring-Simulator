import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProcessPage from './pages/ProcessPage';
import SecurityPage from './pages/SecurityPage';
import ResourcePage from './pages/ResourcePage';
import LogsPage from './pages/LogsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="processes" element={<ProcessPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="resources" element={<ResourcePage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
