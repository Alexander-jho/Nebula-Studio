import { useState } from 'react';
import { 
  Canvas as FabricCanvas, 
  Rect, 
  Circle, 
  IText, 
  FabricImage,
  Triangle
} from 'fabric';
import { 
  Layout, 
  Type, 
  Square, 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Shapes,
  Palette,
  Video,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Star as StarIcon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESIGN_TEMPLATES } from '../lib/templates';
import { fontService } from '../lib/fontService';

const ICON_SETS = [
  { name: 'Redes', icons: ['Instagram', 'Twitter', 'Facebook', 'Linkedin', 'Youtube'] },
  { name: 'Acciones', icons: ['Heart', 'Star', 'Share', 'Download', 'Cloud'] },
  { name: 'Negocio', icons: ['Briefcase', 'DollarSign', 'CreditCard', 'TrendingUp', 'PieChart'] }
];

const TEXT_PRESETS = [
  { label: 'Añadir un título', size: 64, weight: 'bold', style: 'heading' },
  { label: 'Añadir un subtítulo', size: 32, weight: 'semibold', style: 'subheading' },
  { label: 'Añadir texto de cuerpo', size: 16, weight: 'normal', style: 'body' }
];
const PHOTOS_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400', label: 'Abstract 1' },
  { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', label: 'Tech' },
  { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400', label: 'Gradient' },
  { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=400', label: 'Code' },
  { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400', label: 'Retro' },
  { url: 'https://images.unsplash.com/photo-1517336714460-dcee4281358d?auto=format&fit=crop&q=80&w=400', label: 'Space' }
];

interface SidebarProps {
  canvas: FabricCanvas | null;
}

enum SidebarTab {
  TEMPLATES = 'templates',
  ELEMENTS = 'elements',
  TEXT = 'text',
  AI = 'ai',
  STYLES = 'styles',
  UPLOADS = 'uploads',
  PHOTOS = 'photos'
}

export function Sidebar({ canvas }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.ELEMENTS);
  const [fontSearch, setFontSearch] = useState('');

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

  const addTriangle = () => {
    if (!canvas) return;
    const tri = new Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#FACC15'
    });
    canvas.add(tri);
    canvas.setActiveObject(tri);
    canvas.renderAll();
  };

  const addTextPreset = async (preset: typeof TEXT_PRESETS[0]) => {
    if (!canvas) return;
    const text = new IText(preset.label, {
      left: 100,
      top: 100,
      fontSize: preset.size,
      fontFamily: 'Inter',
      fontWeight: preset.weight,
      fill: '#ffffff'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addIcon = (iconName: string) => {
    if (!canvas) return;
    // We simulate an icon with text for now, in a real app would be an SVG
    const text = new IText(iconName.substring(0, 3).toUpperCase(), {
      left: 100,
      top: 100,
      fontSize: 40,
      fontFamily: 'Inter',
      fill: '#8B5CF6',
      fontWeight: 'bold'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addPhoto = async (url: string) => {
    if (!canvas) return;
    try {
      const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
      const scale = 200 / img.width!;
      img.scale(scale);
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    } catch (err) {
      console.error('Error loading image:', err);
    }
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
          icon={<Palette className="w-5 h-5" />} 
          label="Estilos" 
          active={activeTab === SidebarTab.STYLES} 
          onClick={() => setActiveTab(SidebarTab.STYLES)}
        />
        <SidebarIcon 
          icon={<ImageIcon className="w-5 h-5" />} 
          label="Fotos" 
          active={activeTab === SidebarTab.PHOTOS} 
          onClick={() => setActiveTab(SidebarTab.PHOTOS)}
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
          {activeTab === SidebarTab.TEMPLATES && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555]">Explorar Plantillas</h3>
              <div className="grid grid-cols-1 gap-4">
                {DESIGN_TEMPLATES.map((template) => (
                  <button 
                    key={template.id}
                    onClick={() => {
                      if (!canvas) return;
                      canvas.loadFromJSON(template.data).then(() => {
                        canvas.renderAll();
                        useStore.getState().saveHistory(canvas.toJSON());
                      });
                    }}
                    className="group relative h-32 rounded-2xl overflow-hidden border border-[#222] hover:border-[#8B5CF6] transition-all"
                  >
                    <img src={template.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={template.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === SidebarTab.ELEMENTS && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <section className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">Formas Básicas</h3>
                <div className="grid grid-cols-3 gap-2">
                   <ElementButton onClick={addRect} icon={<Square className="text-[#8B5CF6] w-5 h-5" />} label="Bloque" />
                   <ElementButton onClick={addCircle} icon={<CircleIcon className="text-[#D946EF] w-5 h-5" />} label="Círculo" />
                   <ElementButton onClick={addTriangle} icon={<TriangleIcon className="text-[#FACC15] w-5 h-5" />} label="Triángulo" />
                </div>
              </section>

              {ICON_SETS.map((set, idx) => (
                <section key={idx} className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">{set.name}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {set.icons.map(icon => (
                      <button 
                        key={icon}
                        onClick={() => addIcon(icon)}
                        className="aspect-square bg-[#111114] border border-[#222] rounded-lg flex items-center justify-center hover:border-[#8B5CF6] transition-all group"
                      >
                         <div className="text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all text-[10px] font-bold">
                            {icon.substring(0, 3)}
                         </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          )}

          {activeTab === SidebarTab.STYLES && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555]">Paletas de Marca</h3>
              <div className="space-y-4">
                {[
                  { name: 'Cyberpunk', colors: ['#000000', '#FF00A0', '#00FFE0', '#7000FF'] },
                  { name: 'Minimal', colors: ['#FFFFFF', '#F5F5F7', '#E5E5E7', '#F2F2F7'] },
                  { name: 'Cosmos', colors: ['#0F172A', '#334155', '#475569', '#64748B'] },
                  { name: 'Solar', colors: ['#FDBA74', '#F97316', '#EA580C', '#C2410C'] }
                ].map((palette, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        if (!canvas) return;
                        canvas.set('backgroundColor', palette.colors[1]);
                        canvas.renderAll();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-[#222] hover:border-[#333] bg-[#111114] transition-all group"
                  >
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2 group-hover:text-zinc-300">{palette.name}</p>
                    <div className="flex h-8 rounded-lg overflow-hidden border border-[#222]">
                      {palette.colors.map((c, j) => (
                        <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === SidebarTab.PHOTOS && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">Biblioteca Unsplash</h3>
              <div className="grid grid-cols-2 gap-3">
                {PHOTOS_PRESETS.map((photo, i) => (
                  <button 
                    key={i}
                    onClick={() => addPhoto(photo.url)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#222] hover:border-[#8B5CF6] transition-all group"
                  >
                    <img src={photo.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={photo.label} />
                  </button>
                ))}
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
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">Estilos de Texto</h3>
              <div className="space-y-3">
                {TEXT_PRESETS.map((preset, i) => (
                  <button 
                    key={i}
                    onClick={() => addTextPreset(preset)}
                    className="w-full text-left p-4 bg-[#111114] border border-[#222] rounded-xl hover:border-[#8B5CF6] transition-all group overflow-hidden"
                  >
                    <p className={`text-white transition-all group-hover:translate-x-1 truncate ${
                      preset.style === 'heading' ? 'text-2xl font-bold' : 
                      preset.style === 'subheading' ? 'text-lg font-semibold' : 'text-sm'
                    }`}>
                      {preset.label}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-[#1F1F23]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555]">Explorar Fuentes</h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Buscar..." 
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="bg-[#111114] border border-[#222] rounded-md px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#444] w-24"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                   {fontService.getPopularFonts()
                    .filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()))
                    .map(font => (
                     <button 
                      key={font}
                      onClick={async () => {
                        await fontService.loadFont(font);
                        if (!canvas) return;
                        const text = new IText(`Nebula ${font}`, {
                          left: 100,
                          top: 100,
                          fontSize: 40,
                          fontFamily: font,
                          fill: '#ffffff'
                        });
                        canvas.add(text);
                        canvas.setActiveObject(text);
                        canvas.renderAll();
                      }}
                      className="p-2.5 text-left bg-[#0A0A0C] border border-[#1F1F23] rounded-lg hover:bg-[#111114] transition-colors group flex items-center justify-between"
                      style={{ fontFamily: font }}
                     >
                       <span className="text-zinc-400 text-xs group-hover:text-white transition-colors">{font}</span>
                       <ArrowRight className="w-3 h-3 text-[#555] group-hover:text-[#8B5CF6] transition-all opacity-0 group-hover:opacity-100" />
                     </button>
                   ))}
                </div>
              </div>
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
