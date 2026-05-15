import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { useStore } from '../store';

interface CanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
}

export const Canvas = ({ onCanvasReady }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeProject } = useStore();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current || !activeProject) return;

    // Dispose old canvas if anyway
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: activeProject.canvasData.width,
      height: activeProject.canvasData.height,
      backgroundColor: activeProject.canvasData.background || '#ffffff',
      preserveObjectStacking: true,
      stopContextMenu: true,
    });

    fabricCanvasRef.current = canvas;

    // Load state if exists
    if (activeProject.canvasData.objects && activeProject.canvasData.objects.length > 0) {
      canvas.loadFromJSON(activeProject.canvasData, () => {
        canvas.renderAll();
      });
    }

    // Set zoom to fit container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scale = Math.min(
      (width - 40) / activeProject.canvasData.width,
      (height - 40) / activeProject.canvasData.height
    );
    
    canvas.setZoom(scale);
    canvas.setDimensions({
        width: activeProject.canvasData.width * scale,
        height: activeProject.canvasData.height * scale
    }, { backstoreOnly: false });

    // Enable snapping
    canvas.on('object:moving', (options) => {
        const obj = options.target;
        if (!obj) return;
        
        // Simple snapping to grid or guides could be added here
        obj.setCoords();
    });

    onCanvasReady(canvas);
  }, [activeProject, onCanvasReady]);

  useEffect(() => {
    initCanvas();
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [initCanvas]);

  return (
    <div ref={containerRef} className="flex-1 h-full bg-[#050505] flex items-center justify-center overflow-hidden p-10 relative">
      <div className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1F1F23]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
