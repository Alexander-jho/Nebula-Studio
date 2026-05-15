import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricObject, ActiveSelection } from 'fabric';
import { useStore } from '../store';

interface CanvasProps {
  onCanvasReady: (canvas: FabricCanvas) => void;
}

export const Canvas = ({ onCanvasReady }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeProject, history, historyIndex } = useStore();
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!fabricCanvasRef.current || historyIndex === -1) return;
    
    const canvas = fabricCanvasRef.current;
    try {
      const currentState = JSON.parse(history[historyIndex]);
      canvas.loadFromJSON(currentState).then(() => {
        canvas.renderAll();
      });
    } catch (err) {
      console.error('Error loading state from history:', err);
    }
  }, [historyIndex]);

  const initCanvas = useCallback(async () => {
    if (!canvasRef.current || !containerRef.current || !activeProject) return;

    // Dispose old canvas if any
    if (fabricCanvasRef.current) {
      await fabricCanvasRef.current.dispose();
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: activeProject.canvasData.width,
      height: activeProject.canvasData.height,
      backgroundColor: activeProject.canvasData.background || '#ffffff',
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Load state if exists
    if (activeProject.canvasData.objects && activeProject.canvasData.objects.length > 0) {
      try {
        await canvas.loadFromJSON(activeProject.canvasData);
        canvas.renderAll();
      } catch (err) {
        console.error('Error loading canvas sync:', err);
      }
    }

    // Set zoom to fit container
    const updateSize = () => {
      if (!containerRef.current || !fabricCanvasRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const scale = Math.min(
        (width - 80) / activeProject.canvasData.width,
        (height - 80) / activeProject.canvasData.height
      );
      
      canvas.setZoom(scale);
      canvas.setDimensions({
          width: activeProject.canvasData.width * scale,
          height: activeProject.canvasData.height * scale
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Zoom on wheel (Alt + wheel)
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      // If alt key is pressed, zoom to mouse point
      if (opt.e.altKey) {
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      } else {
        canvas.setZoom(zoom);
      }
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    onCanvasReady(canvas);

    // Save History on significant changes
    const saveState = () => {
      useStore.getState().saveHistory(canvas.toJSON());
    };

    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);

    // Initial save
    if (useStore.getState().historyIndex === -1) {
      saveState();
    }

    // Snapping logic
    canvas.on('object:moving', (options) => {
      if (!options.target) return;
      const gridSize = 10;
      const target = options.target;
      
      target.set({
        left: Math.round(target.left! / gridSize) * gridSize,
        top: Math.round(target.top! / gridSize) * gridSize
      });
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      
      // Ctrl + Z / Ctrl + Y (Undo/Redo)
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          useStore.getState().undo();
          return;
        }
        if (e.key === 'y' || (e.key === 'Z' && e.shiftKey)) {
          e.preventDefault();
          useStore.getState().redo();
          return;
        }
      }

      if (!active) return;

      // Don't trigger if typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const moveStep = e.shiftKey ? 10 : 1;

      switch(e.key) {
        case 'Delete':
        case 'Backspace':
          const items = canvas.getActiveObjects();
          items.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          break;
        case 'ArrowLeft': active.set('left', (active.left || 0) - moveStep); break;
        case 'ArrowRight': active.set('left', (active.left || 0) + moveStep); break;
        case 'ArrowUp': active.set('top', (active.top || 0) - moveStep); break;
        case 'ArrowDown': active.set('top', (active.top || 0) + moveStep); break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            canvas.discardActiveObject();
            const sel = new ActiveSelection(canvas.getObjects(), { canvas });
            canvas.setActiveObject(sel);
            canvas.requestRenderAll();
          }
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const activeObjects = canvas.getActiveObjects();
            activeObjects.forEach(obj => {
              obj.clone().then((cloned: FabricObject) => {
                cloned.set({ left: (obj.left || 0) + 10, top: (obj.top || 0) + 10 });
                canvas.add(cloned);
                canvas.renderAll();
              });
            });
          }
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            active.clone().then((cloned: FabricObject) => {
               (canvas as any)._clipboard = cloned;
            });
          }
          break;
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            const clipboard = (canvas as any)._clipboard;
            if (clipboard) {
              clipboard.clone().then((clonedObj: FabricObject) => {
                canvas.discardActiveObject();
                clonedObj.set({
                  left: (clonedObj.left || 0) + 10,
                  top: (clonedObj.top || 0) + 10,
                  evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                  clonedObj.canvas = canvas;
                  (clonedObj as any).forEachObject((obj: any) => canvas.add(obj));
                  clonedObj.setCoords();
                } else {
                  canvas.add(clonedObj);
                }
                (canvas as any)._clipboard.top += 10;
                (canvas as any)._clipboard.left += 10;
                canvas.setActiveObject(clonedObj);
                canvas.requestRenderAll();
              });
            }
          }
          break;
      }
      canvas.renderAll();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject, onCanvasReady]);

  useEffect(() => {
    initCanvas();
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [initCanvas]);

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0 || !canvas) return;

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = async (f) => {
            const img = await FabricImage.fromURL(f.target?.result as string);
            img.scaleToWidth(200);
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    return (
      <div 
        ref={containerRef} 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 h-full bg-[#050505] flex items-center justify-center overflow-hidden p-10 relative"
      >
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />
      <div className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1F1F23] relative z-10">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
