import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

import SplashScreen from './components/SplashScreen';
import RoleSelection from './components/RoleSelection';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function MainFlow() {
  const [step, setStep] = useState('splash');
  const { user, loading } = useAuth();


  const handleSplashFinish = () => {
 
    if (user) {
      setStep('app');
    } else {
      setStep('role');
    }
  };

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    setStep('login');
  };


  const handleBackToRole = () => {
    localStorage.removeItem('selectedRole');
    setStep('role');
  };

  useEffect(() => {
    if (user && step !== 'splash') {
      setStep('app');
    }
  }, [user, step]);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
      
        {step === 'splash' && (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        )}

        {step === 'role' && !user && (
          <RoleSelection key="role" onSelect={handleRoleSelect} />
        )}

       
        {step === 'login' && !user && (
          <Login key="login" onBack={handleBackToRole} />
        )}

        {user && step === 'app' && (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainFlow />
    </AuthProvider>
  );
}