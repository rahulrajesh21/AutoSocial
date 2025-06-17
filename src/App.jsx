import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';

// Layout and Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Automations from './pages/Automations';
import Settings from './pages/Settings';
import Help from './pages/Help';
import HelpDetail from './pages/help/HelpDetail';
import HelpArticle from './pages/help/HelpArticle';
import HelpSearch from './pages/help/HelpSearch';
import AutomationsDesigner  from './pages/AutomationsDesigner';

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
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="help/:category" element={<HelpDetail />} />
            <Route path="help/article/:slug" element={<HelpArticle />} />
            <Route path="help/search" element={<HelpSearch />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/AutomationsDesigner/:id" element={<AutomationsDesigner />} />
        </Routes>
      </SignedIn>
    </>
  );
}
