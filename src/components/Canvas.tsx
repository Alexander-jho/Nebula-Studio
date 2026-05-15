import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStore } from '../store';

interface CanvasProps {
  onCanvasReady: (canvas: FabricCanvas) => void;
}

export const Canvas = ({ onCanvasReady }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeProject } = useStore();
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

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

    onCanvasReady(canvas);

    return () => {
      window.removeEventListener('resize', updateSize);
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

  return (
    <div ref={containerRef} className="flex-1 h-full bg-[#050505] flex items-center justify-center overflow-hidden p-10 relative">
      <div className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1F1F23]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
