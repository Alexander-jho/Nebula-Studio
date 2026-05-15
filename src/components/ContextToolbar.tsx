import React, { useState, useEffect } from 'react';
import { 
  Canvas as FabricCanvas, 
  FabricObject, 
  IText 
} from 'fabric';
import { 
  Type, 
  Trash2, 
  Layers, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  ArrowUpToLine,
  ArrowDownToLine,
  Ungroup,
  Group as GroupIcon
} from 'lucide-react';

interface ContextToolbarProps {
  canvas: FabricCanvas | null;
  activeObject: FabricObject | null;
}

export function ContextToolbar({ canvas, activeObject }: ContextToolbarProps) {
  const [fill, setFill] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(40);
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    if (activeObject) {
      setFill(activeObject.get('fill') as string || '#ffffff');
      if (activeObject instanceof IText) {
        setFontSize(activeObject.fontSize);
      }
      setIsGroup(activeObject.type === 'group' || activeObject.type === 'activeSelection');
    }
  }, [activeObject]);

  const changeColor = (color: string) => {
    if (!canvas || !activeObject) return;
    activeObject.set('fill', color);
    setFill(color);
    canvas.renderAll();
  };

  const deleteObject = () => {
    if (!canvas || !activeObject) return;
    const items = canvas.getActiveObjects();
    items.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const cloneObject = () => {
    if (!canvas || !activeObject) return;
    activeObject.clone().then((cloned: FabricObject) => {
        cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
    });
  };

  const handleGroup = () => {
    if (!canvas || !activeObject) return;
    if (activeObject.type === 'activeSelection') {
      (activeObject as any).toGroup();
      canvas.renderAll();
    } else if (activeObject.type === 'group') {
      (activeObject as any).toActiveSelection();
      canvas.renderAll();
    }
  };

  const changeOrder = (dir: 'front' | 'back') => {
    if (!canvas || !activeObject) return;
    if (dir === 'front') (canvas as any).bringToFront(activeObject);
    else (canvas as any).sendToBack(activeObject);
    canvas.renderAll();
  };

  return (
    <div className="bg-[#111114]/90 border border-[#1F1F23] rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 backdrop-blur-2xl">
      {/* Selection Type & Label */}
      <div className="px-3 py-1 bg-[#1A1A1E] rounded-xl flex items-center gap-2 border border-[#333] mr-1">
         <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
         <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
           {isGroup ? 'Grupo' : (activeObject as any).type || 'Objeto'}
         </span>
      </div>

      {/* Color Picker */}
      {!isGroup && (
        <div className="flex items-center gap-1 px-2 border-r border-[#1F1F23]">
          {[ '#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#8B5CF6', '#D946EF', '#000000' ].map(color => (
            <button 
              key={color}
              onClick={() => changeColor(color)}
              className={`w-5 h-5 rounded-md border border-[#333] transition-all shrink-0 ${fill === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

       {activeObject instanceof IText && (
        <div className="flex items-center gap-1 px-2 border-r border-[#1F1F23]">
           <input 
             type="number" 
             value={fontSize} 
             onChange={(e) => {
               const val = parseInt(e.target.value);
               setFontSize(val);
               activeObject.set('fontSize', val);
               canvas?.renderAll();
             }}
             className="w-12 bg-[#0A0A0C] text-[11px] font-bold border border-[#1F1F23] rounded-lg px-2 py-1 text-white focus:outline-none"
           />
           <button className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white"><Bold className="w-4 h-4" /></button>
           <button className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white"><Italic className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center gap-1 px-1 border-r border-[#1F1F23]">
        <button onClick={() => changeOrder('front')} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white transition-all" title="Traer al frente"><ArrowUpToLine className="w-4 h-4" /></button>
        <button onClick={() => changeOrder('back')} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white transition-all" title="Enviar al fondo"><ArrowDownToLine className="w-4 h-4" /></button>
        <button onClick={handleGroup} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white transition-all" title={isGroup ? "Desagrupar" : "Agrupar"}>
          {isGroup ? <Ungroup className="w-4 h-4" /> : <GroupIcon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <button onClick={cloneObject} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white transition-all" title="Duplicar"><Copy className="w-4 h-4" /></button>
        <button onClick={deleteObject} className="p-2 hover:bg-[#1F1F23] rounded-lg text-red-500/50 hover:text-red-500 transition-all font-bold" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
