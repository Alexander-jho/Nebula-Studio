/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle } from './lib/firebase';
import { useStore } from './store';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Loader2 } from 'lucide-react';

import { Toaster, toast } from 'sonner';

export default function App() {
  const { user, setUser, isGuest, setIsGuest, loading, setLoading, activeProject } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) setIsGuest(false); // If they log in, they are not a guest anymore
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setIsGuest, setLoading]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('¡Bienvenido a Nebula Studio!');
    } catch (err: any) {
      toast.error('Error al iniciar sesión. Entrando como invitado...');
      setIsGuest(true);
      console.error(err);
    }
  };

  const handleGuestEntry = () => {
    setIsGuest(true);
    toast.info('Entrando como invitado');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#D946EF] animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <>
        <LandingPage onLogin={handleLogin} onGuestMode={handleGuestEntry} />
        <Toaster theme="dark" position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#8B5CF6]/30">
      {!activeProject && <Navbar />}
      {activeProject ? <Editor /> : <Dashboard />}
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

