import React, { useState, useCallback, useRef } from 'react';
import * as fabric from 'fabric';
import { useStore } from '../store';
import { Canvas } from './Canvas';
import { Sidebar } from './EditorSidebar';
import { TopBar } from './TopBar';
import { ContextToolbar } from './ContextToolbar';

export function Editor() {
  const { activeProject } = useStore();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  const handleCanvasReady = useCallback((c: fabric.Canvas) => {
    setCanvas(c);
    
    c.on('selection:created', (e) => setSelectedObject(e.selected ? e.selected[0] : null));
    c.on('selection:updated', (e) => setSelectedObject(e.selected ? e.selected[0] : null));
    c.on('selection:cleared', () => setSelectedObject(null));
  }, []);

  if (!activeProject) return null;

  return (
    <div className="h-screen bg-[#09090b] flex flex-col text-white">
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
