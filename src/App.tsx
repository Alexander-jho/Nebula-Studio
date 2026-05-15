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

export default function App() {
  const { user, setUser, loading, setLoading, activeProject } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090b]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={loginWithGoogle} />;
  }

  if (activeProject) {
    return <Editor />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#8B5CF6]/30">
      <Navbar />
      <Dashboard />
    </div>
  );
}

