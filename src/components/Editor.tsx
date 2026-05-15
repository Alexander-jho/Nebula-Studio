import React, { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { useStore } from '../store';
import { Canvas } from './Canvas';
import { Sidebar } from './EditorSidebar';
import { TopBar } from './TopBar';
import { ContextToolbar } from './ContextToolbar';

export function Editor() {
  const { activeProject } = useStore();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

  const handleCanvasReady = useCallback((c: FabricCanvas) => {
    setCanvas(c);
    
    // In Fabric 6+, selection events contain array of selected objects
    c.on('selection:created', (e) => setSelectedObject(e.selected ? e.selected[0] : null));
    c.on('selection:updated', (e) => setSelectedObject(e.selected ? e.selected[0] : null));
    c.on('selection:cleared', () => setSelectedObject(null));
  }, []);

  if (!activeProject) return null;

  return (
    <div className="h-screen bg-[#050505] flex flex-col text-[#E0E0E0]">
      <TopBar canvas={canvas} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar canvas={canvas} />
        
        <main className="flex-1 flex flex-col relative">
          {selectedObject && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
              <ContextToolbar canvas={canvas} activeObject={selectedObject} />
            </div>
          )}
          <Canvas onCanvasReady={handleCanvasReady} />
        </main>
      </div>
    </div>
  );
}
