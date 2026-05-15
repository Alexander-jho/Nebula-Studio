import React, { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { useStore } from '../store';
import { Canvas } from './Canvas';
import { Sidebar } from './EditorSidebar';
import { TopBar } from './TopBar';
import { ContextToolbar } from './ContextToolbar';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';

export function Editor() {
  const { activeProject } = useStore();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

  const handleCanvasReady = useCallback((c: FabricCanvas) => {
    setCanvas(c);
    
    const updateSelection = () => {
      const active = c.getActiveObject();
      setSelectedObject(active || null);
    };

    c.on('selection:created', updateSelection);
    c.on('selection:updated', updateSelection);
    c.on('selection:cleared', updateSelection);
    c.on('object:modified', updateSelection);
  }, []);

  if (!activeProject) return null;

  return (
    <div className="h-screen bg-[#020203] flex flex-col text-[#E0E0E0] selection:bg-indigo-500/30">
      <TopBar canvas={canvas} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar canvas={canvas} />
        
        <main className="flex-1 flex flex-col relative bg-[#08080A] overflow-hidden">
          {selectedObject && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
              <ContextToolbar canvas={canvas} activeObject={selectedObject} />
            </div>
          )}
          <div className="flex-1 flex items-center justify-center p-8 bg-dot-white/[0.05]">
            <div className="shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden border border-[#1F1F23]">
              <Canvas onCanvasReady={handleCanvasReady} />
            </div>
          </div>
        </main>

        <div className="flex flex-col border-l border-[#1F1F23]">
          <div className="h-1/2 flex flex-col border-b border-[#1F1F23]">
            <PropertiesPanel canvas={canvas} activeObject={selectedObject} />
          </div>
          <div className="h-1/2">
            <LayersPanel canvas={canvas} />
          </div>
        </div>
      </div>
    </div>
  );
}
