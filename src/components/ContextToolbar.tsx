import React, { useState, useEffect } from 'react';
import { 
  Canvas as FabricCanvas, 
  FabricObject, 
  IText 
} from 'fabric';
import { 
  Type, 
  Palette, 
  Trash2, 
  Layers, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic
} from 'lucide-react';

interface ContextToolbarProps {
  canvas: FabricCanvas | null;
  activeObject: FabricObject | null;
}

export function ContextToolbar({ canvas, activeObject }: ContextToolbarProps) {
  const [fill, setFill] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(40);

  useEffect(() => {
    if (activeObject) {
      setFill(activeObject.get('fill') as string || '#ffffff');
      if (activeObject instanceof IText) {
        setFontSize(activeObject.fontSize);
      }
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
    canvas.remove(activeObject);
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

  return (
    <div className="bg-[#111114] border border-[#1F1F23] rounded-2xl shadow-2xl p-2 flex items-center gap-2 backdrop-blur-xl">
      {/* Color Picker */}
      <div className="flex items-center gap-1.5 px-2 border-r border-[#1F1F23]">
         {[ '#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#8B5CF6', '#D946EF', '#000000' ].map(color => (
           <button 
             key={color}
             onClick={() => changeColor(color)}
             className={`w-5 h-5 rounded-md border border-[#333] transition-all ${fill === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
             style={{ backgroundColor: color }}
           />
         ))}
      </div>

       {activeObject instanceof IText && (
        <div className="flex items-center gap-1.5 px-2 border-r border-[#1F1F23]">
           <input 
             type="number" 
             value={fontSize} 
             onChange={(e) => {
               const val = parseInt(e.target.value);
               setFontSize(val);
               activeObject.set('fontSize', val);
               canvas?.renderAll();
             }}
             className="w-14 bg-[#0A0A0C] text-[11px] font-bold border border-[#1F1F23] rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#444]"
           />
           <button className="p-2 hover:bg-[#1F1F23] rounded-lg transition-all text-[#555] hover:text-white"><Bold className="w-4 h-4" /></button>
           <button className="p-2 hover:bg-[#1F1F23] rounded-lg transition-all text-[#555] hover:text-white"><Italic className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center gap-1 pl-1">
        <button onClick={cloneObject} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-white transition-all shadow-sm" title="Duplicar"><Copy className="w-4 h-4" /></button>
        <button onClick={deleteObject} className="p-2 hover:bg-[#1F1F23] rounded-lg text-[#555] hover:text-red-500 transition-all shadow-sm" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
