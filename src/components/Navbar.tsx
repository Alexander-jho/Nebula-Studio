import { auth, logout } from '../lib/firebase';
import { useStore } from '../store';
import { LogOut, User as UserIcon, Bell, Search, Menu } from 'lucide-react';

export function Navbar() {
  const { user, setIsGuest } = useStore();

  const handleLogout = async () => {
    if (user) {
      await logout();
    }
    setIsGuest(false);
  };

  return (
    <nav className="h-16 border-b border-[#1F1F23] bg-[#050505] sticky top-0 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6366F1] to-[#D946EF] rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg italic text-white">N</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Nebula<span className="font-light opacity-60 ml-0.5">Studio</span></h1>
        </div>
        
        <div className="relative hidden lg:flex items-center flex-1 max-w-lg ml-4">
          <Search className="absolute left-4 w-4 h-4 text-[#555]" />
          <input 
            type="text" 
            placeholder="Search millions of free templates, fonts, and AI models..."
            className="w-[450px] bg-[#111114] border border-[#222] rounded-lg px-4 py-2 pl-11 text-sm focus:outline-none focus:border-[#444] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-600"></div>
          <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-indigo-500"></div>
          <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-pink-500"></div>
        </div>

        <button className="bg-white text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all active:scale-95">
          Crear Proyecto
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-[#1F1F23]">
           <button 
             onClick={handleLogout}
             title={user ? "Cerrar sesión" : "Volver al inicio"}
             className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center bg-[#1F1F23] hover:border-[#444] transition-all relative group"
           >
             {user?.photoURL ? (
               <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
             ) : (
               <UserIcon className="w-5 h-5 text-zinc-400" />
             )}
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
             
             <div className="absolute top-12 right-0 hidden group-hover:block bg-[#111114] border border-[#222] text-xs py-2 px-3 rounded shadow-xl whitespace-nowrap">
               {user ? "Cerrar Sesión" : "Modo Invitado (Salir)"}
               <div className="flex items-center mt-1 text-[10px] text-zinc-500">
                  <LogOut className="w-3 h-3 mr-1" /> Logout
               </div>
             </div>
           </button>
        </div>
      </div>
    </nav>
  );
}
