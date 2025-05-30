import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';

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
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: "#18181B",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
        }}
      />
      <SignedOut>
        <div className="h-screen w-full flex items-center justify-center bg-primary">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      
      <SignedIn>
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
      </SignedIn>
    </>
  );
}
