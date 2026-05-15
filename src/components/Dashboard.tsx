import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DESIGN_TEMPLATES, Project } from '../types';
import { useStore } from '../store';
import { Plus, Clock, Star, Trash2, Folder, LayoutGrid, List, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { projectService } from '../lib/projectService';
import { toast } from 'sonner';

export function Dashboard() {
  const { setActiveProject, user } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    try {
      const data = await projectService.getProjectsByUser(user.uid);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCreateProject = async (template: any) => {
    const id = uuidv4();
    const newProject = {
      id,
      name: `Diseño ${template.name}`,
      type: template.type,
      ownerId: user?.uid || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvasData: {
        version: "5.3.0",
        objects: [],
        background: "#ffffff",
        width: template.width,
        height: template.height
      }
    };

    try {
      await projectService.createProject(newProject);
      setActiveProject(newProject as Project);
      toast.success('Proyecto creado correctamente');
    } catch (err) {
      toast.error('Error al crear el proyecto');
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;
    
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Proyecto eliminado');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Hero Banner from Design */}
      <div className="relative h-56 rounded-3xl overflow-hidden bg-[#0F0F12] border border-[#1F1F23] mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(139,92,246,0.15),transparent)]"></div>
        <div className="relative z-10 p-10 flex flex-col justify-center h-full">
          <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 text-[#A78BFA] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 w-fit">
            Nuevo: Nebula AI Hub
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Crea sin límites. <br/>Totalmente gratis.</h2>
          <p className="text-[#A1A1AA] max-w-sm text-sm">Prueba el motor creativo más potente. Sin suscripciones, sin muros de pago.</p>
        </div>
        <div className="absolute right-12 bottom-0 top-0 hidden md:flex items-center">
           <div className="grid grid-cols-2 gap-4">
              <div className="w-20 h-28 bg-[#1A1A1E] rounded-xl border border-[#333] transform -rotate-12 translate-y-8"></div>
              <div className="w-20 h-28 bg-gradient-to-br from-[#6366F1] to-[#D946EF] rounded-xl transform rotate-6"></div>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex gap-12">
        {/* Left Sidebar Links - Styled as per Design Nav */}
        <aside className="w-60 hidden md:block space-y-1 shrink-0">
          <h3 className="px-6 pb-2 text-[10px] uppercase tracking-widest text-[#555] font-bold">Principal</h3>
          <NavItem icon={<Clock className="w-4 h-4" />} label="Recientes" active />
          <NavItem icon={<Star className="w-4 h-4" />} label="Favoritos" />
          <NavItem icon={<Folder className="w-4 h-4" />} label="Mis Diseños" />
          <NavItem icon={<Trash2 className="w-4 h-4" />} label="Papelera" />
          
          <div className="pt-8 space-y-1">
            <h3 className="px-6 pb-2 text-[10px] uppercase tracking-widest text-[#555] font-bold">Creación</h3>
            <NavItem icon={<div className="w-2 h-2 rounded-full bg-[#8B5CF6] blur-[2px]" />} label="Nebula AI Hub" />
            <button className="w-full flex items-center gap-3 px-6 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-zinc-900 rounded-lg transition-all">
              <Plus className="w-4 h-4" />
              Nuevo Equipo
            </button>
          </div>

          <div className="mt-12 px-2">
            <div className="bg-gradient-to-br from-[#1A1A1E] to-[#0A0A0C] border border-[#2A2A2E] p-4 rounded-xl">
              <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-2">Estado</p>
              <p className="text-xs text-white font-medium">Modo Ilimitado Activo</p>
              <p className="text-[10px] text-[#22C55E] mt-1">Funciones Premium Gratis</p>
            </div>
          </div>
        </aside>

        {/* Recent Work */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555]">Proyectos Recientes</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#8B5CF6] cursor-pointer hover:underline">Ver todo</span>
              <div className="flex items-center gap-1 p-0.5 bg-[#111114] rounded-lg border border-[#222]">
                <button className="p-1 px-1.5 text-white bg-[#1F1F23] rounded-md"><LayoutGrid className="w-3.5 h-3.5" /></button>
                <button className="p-1 px-1.5 text-zinc-500 hover:text-white"><List className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProjects ? (
              <div className="col-span-full h-32 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full h-32 border border-dashed border-[#222] rounded-2xl flex flex-col items-center justify-center text-[#555]">
                <Folder className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">Aún no tienes proyectos</p>
              </div>
            ) : (
              projects.map((project) => (
                <motion.div 
                  key={project.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveProject(project)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video bg-[#111114] border border-[#222] rounded-xl mb-3 flex items-center justify-center p-4 relative overflow-hidden">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} className="w-full h-full object-cover rounded shadow-inner" alt={project.name} />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1E] rounded shadow-inner overflow-hidden flex items-center justify-center">
                        <div className="w-12 h-0.5 bg-[#333] rounded-full opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                       <button 
                        onClick={(e) => handleDelete(e, project.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg backdrop-blur-sm transition-all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white group-hover:text-[#8B5CF6] transition-colors line-clamp-1">{project.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[11px] text-[#555]">Editado {new Date(project.updatedAt).toLocaleDateString()}</p>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#1F1F23] rounded transition-all">
                      <Star className="w-3.5 h-3.5 text-zinc-600" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <section className="mt-16">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-6">Empezar de cero</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {DESIGN_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleCreateProject(template)}
                  className="group flex flex-col items-center gap-3 p-6 bg-[#111114] border border-[#222] rounded-2xl hover:border-[#444] hover:bg-[#18181b] transition-all active:scale-95 shrink-0 w-36"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1E] border border-[#333] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all">
                     <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider group-hover:text-zinc-300 text-center">{template.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-6 py-2 transition-all cursor-pointer ${
      active ? 'bg-[#1F1F23] text-white' : 'opacity-60 hover:opacity-100 text-[#E0E0E0]'
    }`}>
      <div className="shrink-0">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
