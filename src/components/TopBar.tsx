import * as fabric from 'fabric';
import { 
  ChevronLeft, 
  Undo2, 
  Redo2, 
  Download, 
  Share2, 
  Play, 
  Cloud,
  Settings
} from 'lucide-react';
import { useStore } from '../store';
import confetti from 'canvas-confetti';

interface TopBarProps {
  canvas: fabric.Canvas | null;
}

export function TopBar({ canvas }: TopBarProps) {
  const { setActiveProject, activeProject } = useStore();

  const handleExport = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    const link = document.createElement('a');
    link.download = `${activeProject?.name || 'design'}.png`;
    link.href = dataURL;
    link.click();
    confetti();
  };

  return (
    <header className="h-14 border-b border-[#1F1F23] bg-[#050505] px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveProject(null)}
          className="p-2 hover:bg-[#111114] border border-transparent hover:border-[#222] rounded-lg transition-all text-[#555] hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold truncate max-w-[200px] text-white tracking-tight">{activeProject?.name}</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111114] border border-[#222] text-[9px] text-zinc-500 font-bold uppercase tracking-[0.15em]">
               <Cloud className="w-3 h-3 text-[#22C55E]" />
               Sync Ready
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <div className="flex items-center border-r border-[#1F1F23] pr-3 mr-3 gap-1">
            <button className="p-2 text-[#555] hover:text-white disabled:opacity-20 hover:bg-[#111114] rounded-md transition-all"><Undo2 className="w-4 h-4" /></button>
            <button className="p-2 text-[#555] hover:text-white disabled:opacity-20 hover:bg-[#111114] rounded-md transition-all"><Redo2 className="w-4 h-4" /></button>
         </div>

         <button className="px-4 py-1.5 rounded-lg text-xs font-bold border border-[#1F1F23] hover:border-[#333] hover:bg-[#111114] flex items-center gap-2 transition-all uppercase tracking-widest text-[#A1A1AA]">
            <Share2 className="w-3.5 h-3.5" />
            Share
         </button>
         
         <button 
           onClick={handleExport}
           className="px-5 py-1.5 rounded-lg text-xs font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg shadow-purple-600/10 flex items-center gap-2 transition-all uppercase tracking-widest group"
         >
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            Export
         </button>
      </div>
    </header>
  );
}
