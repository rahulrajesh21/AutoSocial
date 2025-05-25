import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout and Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Automations from './pages/Automations';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Help from './pages/Help';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="automations" element={<Automations />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
