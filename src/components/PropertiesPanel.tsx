import React from 'react';
import { Canvas as FabricCanvas, FabricObject, Rect, IText } from 'fabric';
import { Shadow } from 'fabric';
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  AlignVerticalJustifyCenter, 
  AlignVerticalJustifyStart, 
  AlignVerticalJustifyEnd,
  Maximize,
  Minimize,
  SlidersHorizontal,
  Square,
  Circle as CircleIcon,
  Type,
  Sun,
  Contrast,
  Image as ImageIcon,
  Wind,
  ArrowUp,
  ArrowDown,
  LetterText,
  AlignJustify
} from 'lucide-react';
import { fontService } from '../lib/fontService';
import { filters } from 'fabric';

interface PropertiesPanelProps {
  canvas: FabricCanvas | null;
  activeObject: FabricObject | null;
}

export function PropertiesPanel({ canvas, activeObject }: PropertiesPanelProps) {
  if (!activeObject || !canvas) {
    return (
      <div className="flex flex-col h-full bg-[#050505] border-l border-[#1F1F23] w-72 p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full opacity-20 text-zinc-500 space-y-4">
          <SlidersHorizontal className="w-12 h-12" />
          <p className="text-xs font-medium text-center">Selecciona un elemento para editar sus propiedades</p>
        </div>
      </div>
    );
  }

  const isImage = activeObject.type === 'image';

  const isText = activeObject instanceof IText;

  const updateProperty = (key: string, value: any) => {
    activeObject.set(key as any, value);
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  const updateShadow = (prop: string, value: any) => {
    const shadow = (activeObject.shadow as any) || new Shadow({ color: 'rgba(0,0,0,0.5)', blur: 0, offsetX: 0, offsetY: 0 });
    shadow[prop] = value;
    updateProperty('shadow', shadow);
  };

  const handleFontChange = async (font: string) => {
    await fontService.loadFont(font);
    updateProperty('fontFamily', font);
  };

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'
  ];

  const applyImageFilter = (filterName: string, value: number) => {
    if (!isImage) return;
    const img = activeObject as any;
    
    let filter;
    switch(filterName) {
      case 'brightness': filter = new filters.Brightness({ brightness: value }); break;
      case 'contrast': filter = new filters.Contrast({ contrast: value }); break;
      case 'blur': filter = new filters.Blur({ blur: value }); break;
      default: return;
    }

    // Simple approach for now: replace all filters or append
    img.filters = [filter];
    img.applyFilters();
    canvas.renderAll();
  };

  const align = (type: string) => {
    const active = canvas.getActiveObject();
    if (!active) return;

    const center = canvas.getCenterPoint();

    switch (type) {
      case 'left': active.set('left', 0); break;
      case 'center': canvas.centerObjectH(active); break;
      case 'right': active.set('left', canvas.width! - (active.getScaledWidth())); break;
      case 'top': active.set('top', 0); break;
      case 'middle': canvas.centerObjectV(active); break;
      case 'bottom': active.set('top', canvas.height! - (active.getScaledHeight())); break;
    }
    
    canvas.renderAll();
    // Fire modified event to sync with other components
    canvas.fire('object:modified');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border-l border-[#1F1F23] w-72 p-4 overflow-y-auto custom-scrollbar">
      {/* Header Info */}
      <div className="flex items-center gap-3 mb-6 p-2 bg-[#111114] rounded-xl border border-[#1F1F23]">
        <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
          {activeObject instanceof IText ? <Type className="w-5 h-5 text-[#8B5CF6]" /> : 
           activeObject instanceof Rect ? <Square className="w-5 h-5 text-[#8B5CF6]" /> :
           <CircleIcon className="w-5 h-5 text-[#8B5CF6]" />}
        </div>
        <div>
          <p className="text-[11px] font-bold text-white uppercase tracking-wider">
            {(activeObject as any).type || 'Elemento'}
          </p>
          <p className="text-[10px] text-zinc-500">ID: {activeObject.get('name')?.substring(0, 8) || 'N/A'}</p>
        </div>
      </div>

      {/* Alignment Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Alineación</h3>
        <div className="grid grid-cols-6 gap-1 bg-[#111114] p-1 rounded-xl border border-[#1F1F23]">
          <button onClick={() => align('left')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Izquierda"><AlignLeft className="w-4 h-4" /></button>
          <button onClick={() => align('center')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Centro"><AlignCenter className="w-4 h-4" /></button>
          <button onClick={() => align('right')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Derecha"><AlignRight className="w-4 h-4" /></button>
          <button onClick={() => align('top')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Arriba"><AlignVerticalJustifyStart className="w-4 h-4" /></button>
          <button onClick={() => align('middle')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Medio"><AlignVerticalJustifyCenter className="w-4 h-4" /></button>
          <button onClick={() => align('bottom')} className="p-2 hover:bg-[#1F1F23] hover:text-white text-zinc-500 rounded-lg transition-all" title="Abajo"><AlignVerticalJustifyEnd className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Geometry Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Geometría</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-medium ml-1">Ancho</label>
            <input 
              type="number" 
              value={Math.round(activeObject.getScaledWidth())}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                activeObject.set('scaleX', val / activeObject.width!);
                canvas.renderAll();
              }}
              className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#8B5CF6]/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-medium ml-1">Alto</label>
            <input 
              type="number" 
              value={Math.round(activeObject.getScaledHeight())}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                activeObject.set('scaleY', val / activeObject.height!);
                canvas.renderAll();
              }}
              className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#8B5CF6]/50"
            />
          </div>
        </div>

        {activeObject instanceof Rect && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] text-zinc-500 font-medium">Radio de Borde</label>
              <span className="text-[10px] font-mono text-zinc-400">{(activeObject as any).rx || 0}px</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={(activeObject as any).rx || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                activeObject.set({ rx: val, ry: val });
                canvas.renderAll();
              }}
              className="w-full h-1.5 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>
        )}
      </div>

      {/* Style Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Tipografía</h3>
        
        {isText && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-medium ml-1">Fuente</label>
              <select 
                value={(activeObject as any).fontFamily}
                onChange={(e) => handleFontChange(e.target.value)}
                className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]/50"
              >
                {fontService.getPopularFonts().map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-medium ml-1">Tamaño</label>
                <input 
                  type="number" 
                  value={(activeObject as any).fontSize}
                  onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                  className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-medium ml-1">Interlineado</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={(activeObject as any).lineHeight}
                  onChange={(e) => updateProperty('lineHeight', parseFloat(e.target.value))}
                  className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] text-zinc-500 font-medium">Espaciado de Letras</label>
                <span className="text-[10px] font-mono text-zinc-400">{(activeObject as any).charSpacing || 0}</span>
              </div>
              <input 
                type="range" 
                min="-100" max="1000" 
                value={(activeObject as any).charSpacing || 0}
                onChange={(e) => updateProperty('charSpacing', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
              />
            </div>
          </>
        )}

        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 pt-4">Sombra</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
             <div className="flex justify-between items-center px-1">
                <label className="text-[10px] text-zinc-500 font-medium">Difuminado</label>
                <span className="text-[10px] font-mono text-zinc-400">{Math.round((activeObject.shadow as any)?.blur || 0)}</span>
             </div>
             <input 
                type="range" min="0" max="50" 
                value={(activeObject.shadow as any)?.blur || 0}
                onChange={(e) => updateShadow('blur', parseInt(e.target.value))}
                className="w-full h-1 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
             />
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-medium ml-1">Offset X</label>
                <input 
                  type="number" 
                  value={(activeObject.shadow as any)?.offsetX || 0}
                  onChange={(e) => updateShadow('offsetX', parseInt(e.target.value))}
                  className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-1.5 text-[10px] font-mono text-white focus:outline-none"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-medium ml-1">Offset Y</label>
                <input 
                  type="number" 
                  value={(activeObject.shadow as any)?.offsetY || 0}
                  onChange={(e) => updateShadow('offsetY', parseInt(e.target.value))}
                  className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-1.5 text-[10px] font-mono text-white focus:outline-none"
                />
             </div>
          </div>
          <div className="pt-1">
             <label className="text-[10px] text-zinc-500 font-medium ml-1 block mb-1">Color de Sombra</label>
             <input 
                type="color" 
                value={(activeObject.shadow as any)?.color || '#000000'}
                onChange={(e) => updateShadow('color', e.target.value)}
                className="w-full h-6 rounded border-0 bg-transparent cursor-pointer p-0"
              />
          </div>
        </div>

        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 pt-4">Capas & Orden</h3>
        <div className="grid grid-cols-2 gap-2">
           <button 
            onClick={() => { canvas.bringObjectToFront(activeObject); canvas.renderAll(); }}
            className="flex items-center justify-center gap-2 p-3 bg-[#111114] border border-[#1F1F23] rounded-xl hover:bg-[#1A1A1E] text-zinc-400 hover:text-white transition-all"
           >
             <ArrowUp className="w-3 h-3" /> <span className="text-[9px] font-bold uppercase">Frente</span>
           </button>
           <button 
            onClick={() => { canvas.sendObjectToBack(activeObject); canvas.renderAll(); }}
            className="flex items-center justify-center gap-2 p-3 bg-[#111114] border border-[#1F1F23] rounded-xl hover:bg-[#1A1A1E] text-zinc-400 hover:text-white transition-all"
           >
             <ArrowDown className="w-3 h-3" /> <span className="text-[9px] font-bold uppercase">Fondo</span>
           </button>
        </div>

        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 pt-4">Apariencia</h3>
        
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-500 font-medium ml-1">Modo de Mezcla</label>
          <select 
            value={(activeObject as any).globalCompositeOperation || 'source-over'}
            onChange={(e) => updateProperty('globalCompositeOperation', e.target.value)}
            className="w-full bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]/50 uppercase tracking-widest font-bold"
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode === 'normal' ? 'source-over' : mode}>{mode}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] text-zinc-500 font-medium">Opacidad</label>
            <span className="text-[10px] font-mono text-zinc-400">{Math.round((activeObject.opacity || 1) * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={(activeObject.opacity || 1) * 100}
            onChange={(e) => {
              const val = parseInt(e.target.value) / 100;
              updateProperty('opacity', val);
            }}
            className="w-full h-1.5 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
          />
        </div>

        <div className="pt-2">
           <label className="text-[10px] text-zinc-500 font-medium ml-1 block mb-2">Color de Relleno</label>
           <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={activeObject.fill as string || '#ffffff'}
                onChange={(e) => updateProperty('fill', e.target.value)}
                className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0"
              />
              <input 
                type="text" 
                value={activeObject.fill as string || '#ffffff'}
                onChange={(e) => updateProperty('fill', e.target.value)}
                className="flex-1 bg-[#111114] border border-[#1F1F23] rounded-lg px-3 py-1.5 text-[11px] font-mono text-white focus:outline-none"
              />
           </div>
        </div>

        {isImage && (
          <div className="space-y-4 pt-6 border-t border-[#1F1F23] mt-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Filtros Nebula</h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Sun className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Brillo</span>
                  </div>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.1" defaultValue="0"
                  onChange={(e) => applyImageFilter('brightness', parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Contrast className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Contraste</span>
                  </div>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.1" defaultValue="0"
                  onChange={(e) => applyImageFilter('contrast', parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Wind className="w-3 h-3" />
                    <span className="text-[10px] font-medium">Desenfoque</span>
                  </div>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" defaultValue="0"
                  onChange={(e) => applyImageFilter('blur', parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#111114] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

       {/* Quick Actions */}
       <div className="mt-auto pt-6 border-t border-[#1F1F23]">
          <button 
            onClick={() => {
              activeObject.clone().then((cloned: FabricObject) => {
                cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.renderAll();
              });
            }}
            className="w-full py-2 bg-[#111114] hover:bg-[#1A1A1E] text-zinc-300 rounded-xl text-xs font-bold transition-all border border-[#1F1F23] mb-2"
          >
            Duplicar Objeto
          </button>
          <button 
            onClick={() => {
              canvas.remove(activeObject);
              canvas.discardActiveObject();
              canvas.renderAll();
            }}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all border border-red-500/20"
          >
            Eliminar Objeto
          </button>
       </div>
    </div>
  );
}
