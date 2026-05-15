import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { Layers, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react';

interface LayersPanelProps {
  canvas: FabricCanvas | null;
}

export function LayersPanel({ canvas }: LayersPanelProps) {
  const [objects, setObjects] = useState<FabricObject[]>([]);
  const [, setUpdate] = useState(0);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      // Fabric objects are stored bottom-to-top, but we want to show top-to-bottom in the UI
      setObjects([...canvas.getObjects()].reverse());
    };

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    
    updateLayers();

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const toggleVisibility = (obj: FabricObject) => {
    obj.set('visible', !obj.visible);
    canvas?.renderAll();
    setUpdate(prev => prev + 1);
  };

  const toggleLock = (obj: FabricObject) => {
    const isLocked = !obj.selectable;
    obj.set({
      selectable: !isLocked,
      evented: !isLocked,
      hasControls: !isLocked,
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
    });
    canvas?.renderAll();
    setUpdate(prev => prev + 1);
  };

  const moveLayer = (obj: FabricObject, direction: 'up' | 'down') => {
    if (!canvas) return;
    if (direction === 'up') {
      (canvas as any).bringForward(obj);
    } else {
      (canvas as any).sendBackwards(obj);
    }
    setObjects([...canvas.getObjects()].reverse());
  };

  const selectObject = (obj: FabricObject) => {
    if (!canvas || !obj.selectable) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C] border-l border-[#1F1F23] w-64">
      <div className="p-4 border-b border-[#1F1F23] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Capas</span>
        </div>
        <span className="text-[10px] bg-[#111114] px-1.5 py-0.5 rounded text-zinc-500 font-mono">
          {objects.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {objects.map((obj, i) => {
          const isActive = canvas?.getActiveObject() === obj;
          const type = (obj as any).type || 'object';
          
          return (
            <div 
              key={i}
              onClick={() => selectObject(obj)}
              className={`group flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                isActive ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/20' : 'hover:bg-[#111114] border border-transparent'
              }`}
            >
              <div className="w-8 h-8 rounded bg-[#1A1A1E] flex items-center justify-center shrink-0 border border-[#333]">
                 <span className="text-[10px] uppercase font-bold text-zinc-600">
                    {type.substring(0, 2)}
                 </span>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <p className={`text-[11px] truncate ${isActive ? 'text-white font-medium' : 'text-zinc-400'}`}>
                  { (obj as any).name || `${type} ${objects.length - i}` }
                </p>
              </div>

              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveLayer(obj, 'up'); }}
                  className="p-1 hover:text-white text-zinc-600 transition-colors"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveLayer(obj, 'down'); }}
                  className="p-1 hover:text-white text-zinc-600 transition-colors"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLock(obj); }}
                  className={`p-1 transition-colors ${!obj.selectable ? 'text-amber-500' : 'hover:text-white text-zinc-600'}`}
                >
                  {!obj.selectable ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }}
                  className={`p-1 transition-colors ${!obj.visible ? 'text-zinc-600' : 'hover:text-white text-zinc-600'}`}
                >
                  {!obj.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          );
        })}

        {objects.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-zinc-600 opacity-20">
            <Layers className="w-8 h-8 mb-2" />
            <p className="text-[10px]">Sin capas</p>
          </div>
        )}
      </div>
    </div>
  );
}
