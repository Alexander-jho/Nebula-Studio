import { useState } from 'react';
import { 
  Canvas as FabricCanvas, 
  Rect, 
  Circle, 
  IText, 
  FabricImage 
} from 'fabric';
import { 
  Layout, 
  Type, 
  Square, 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Shapes,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  canvas: FabricCanvas | null;
}

enum SidebarTab {
  TEMPLATES = 'templates',
  ELEMENTS = 'elements',
  TEXT = 'text',
  AI = 'ai',
  UPLOADS = 'uploads'
}

export function Sidebar({ canvas }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.ELEMENTS);

  const addRect = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: '#8B5CF6',
      width: 100,
      height: 100,
      rx: 12,
      ry: 12
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new Circle({
      left: 150,
      top: 150,
      fill: '#D946EF',
      radius: 50
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new IText('Nebula Studio', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fontSize: 40,
      fill: '#E0E0E0'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <div className="w-80 border-r border-[#1F1F23] flex h-full bg-[#050505]">
      {/* Icon Rail */}
      <div className="w-18 border-r border-[#1F1F23] flex flex-col items-center py-6 gap-3 shrink-0 bg-[#0A0A0C]">
        <SidebarIcon 
          icon={<Layout className="w-5 h-5" />} 
          label="Diseños" 
          active={activeTab === SidebarTab.TEMPLATES} 
          onClick={() => setActiveTab(SidebarTab.TEMPLATES)}
        />
        <SidebarIcon 
          icon={<Shapes className="w-5 h-5" />} 
          label="Capas" 
          active={activeTab === SidebarTab.ELEMENTS} 
          onClick={() => setActiveTab(SidebarTab.ELEMENTS)}
        />
        <SidebarIcon 
          icon={<Type className="w-5 h-5" />} 
          label="Texto" 
          active={activeTab === SidebarTab.TEXT} 
          onClick={() => setActiveTab(SidebarTab.TEXT)}
        />
        <SidebarIcon 
          icon={<Sparkles className="w-5 h-5" />} 
          label="IA Hub" 
          active={activeTab === SidebarTab.AI} 
          onClick={() => setActiveTab(SidebarTab.AI)}
        />
        <SidebarIcon 
          icon={<Upload className="w-5 h-5" />} 
          label="Nube" 
          active={activeTab === SidebarTab.UPLOADS} 
          onClick={() => setActiveTab(SidebarTab.UPLOADS)}
        />
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === SidebarTab.ELEMENTS && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555]">Elementos Dinámicos</h3>
              <div className="grid grid-cols-2 gap-3">
                 <ElementButton onClick={addRect} icon={<Square className="text-[#8B5CF6] w-6 h-6" />} label="Bloque" />
                 <ElementButton onClick={addCircle} icon={<Shapes className="text-[#D946EF] w-6 h-6" />} label="Forma" />
              </div>
            </motion.div>
          )}

          {activeTab === SidebarTab.TEXT && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555]">Tipografía</h3>
              <button 
                onClick={addText}
                className="w-full py-6 text-center border border-[#333] bg-[#111114] rounded-xl hover:border-[#8B5CF6] transition-all group"
              >
                <span className="text-sm font-bold text-white group-hover:text-[#8B5CF6]">Añadir Caja de Texto</span>
              </button>
            </motion.div>
          )}

          {activeTab === SidebarTab.AI && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                IA Generativa Ilimitada
              </h3>
              <AiImageGenerator canvas={canvas} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SidebarIcon({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 group w-full py-1.5 transition-all outline-none ${active ? 'text-white' : 'text-[#555] hover:text-[#E0E0E0]'}`}
    >
      <div className={`p-2 rounded-lg transition-all ${active ? 'bg-[#1F1F23] ring-1 ring-[#333]' : 'group-hover:bg-[#111114]'}`}>
        {icon}
      </div>
      <span className="text-[9px] uppercase font-bold tracking-[0.1em]">{label}</span>
    </button>
  );
}

function ElementButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-5 bg-[#111114] border border-[#222] rounded-xl hover:bg-[#18181b] hover:border-[#333] transition-all active:scale-95 group"
    >
      <div className="transition-transform group-hover:scale-110">{icon}</div>
      <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider group-hover:text-zinc-300">{label}</span>
    </button>
  );
}

function AiImageGenerator({ canvas }: { canvas: FabricCanvas | null }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt || !canvas) return;
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.imageUrl) {
        const img = await FabricImage.fromURL(data.imageUrl, { crossOrigin: 'anonymous' });
        img.scaleToWidth(canvas.width! / 1.5);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateLogo = async () => {
    if (!prompt || !canvas) return;
    setLoading(true);
    try {
      const systemInstruction = "Eres un diseñador de logos experto. Crea un logo minimalista, moderno y profesional basado en la descripción del usuario.";
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Logo design for: ${prompt}. Professional, vector style, white background, high quality.`, systemInstruction })
      });
      const data = await response.json();
      if (data.imageUrl) {
        const img = await FabricImage.fromURL(data.imageUrl, { crossOrigin: 'anonymous' });
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111114] border border-[#222] rounded-2xl p-4 focus-within:border-[#444] transition-all">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe tu visión creativa..."
          className="w-full bg-transparent text-sm focus:outline-none resize-none h-28 placeholder:text-[#333]"
        />
        <div className="flex gap-2 pt-2 mt-2 border-t border-[#1F1F23]">
            <button 
            onClick={generate}
            disabled={loading || !prompt}
            className="flex-1 py-2.5 bg-[#1F1F23] border border-[#333] hover:bg-[#2A2A2E] rounded-xl text-[10px] font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
            >
            {loading ? '...' : <><Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Imagen</>}
            </button>
            <button 
            onClick={generateLogo}
            disabled={loading || !prompt}
            className="flex-1 py-2.5 bg-gradient-to-tr from-[#6366F1] to-[#D946EF] rounded-xl text-[10px] font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest transition-all shadow-lg shadow-purple-500/10"
            >
            {loading ? '...' : <><Layout className="w-3.5 h-3.5" /> Logo</>}
            </button>
        </div>
      </div>
      <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 p-3 rounded-xl">
        <p className="text-[10px] text-[#A78BFA] italic text-center font-medium">
          Motor Nebula v3.2: Generación ultra-rápida gratuita desbloqueada.
        </p>
      </div>
    </div>
  );
}
