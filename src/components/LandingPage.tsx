import { motion } from 'motion/react';
import { Sparkles, Layout, Video, Image as ImageIcon, MousePointer2, Share2, Layers } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] selection:bg-[#8B5CF6]/30 overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6366F1]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D946EF]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#6366F1] to-[#D946EF] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Nebula<span className="font-light opacity-60 ml-0.5">Studio</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
          <a href="#" className="hover:text-[#8B5CF6] transition-colors">AI Hub</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onLogin}
          className="px-6 py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          Start Creating
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111114] border border-[#222] text-[10px] font-bold tracking-widest text-[#A1A1AA] uppercase mb-8">
            <Sparkles className="w-3 h-3 text-[#A78BFA]" />
            <span>New: Gen-5 Motion IA Engine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-white">
            DESIGN THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#D946EF]">UNLIMITED</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg md:text-xl max-w-xl mx-auto mb-12">
            The world's most powerful professional creative suite. Graphics, Video, IA and Collaboration. 
            No tiers, no walls, just pure creation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-[#6366F1] text-white rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
            >
              Crea tu primer diseño
              <MousePointer2 className="inline ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-[#111114] text-white rounded-xl font-bold text-lg hover:bg-[#1A1A1E] transition-all border border-[#222] active:scale-95">
              Explore Templates
            </button>
          </div>
        </motion.div>

        {/* Feature Grid Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative"
        >
          <div className="bg-[#0A0A0C]/50 rounded-[40px] border border-[#1F1F23] p-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(139,92,246,0.1),transparent)] pointer-events-none"></div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                <FeatureItem icon={<Layout />} title="Graphics & Vector" desc="Professional vector engine" />
                <FeatureItem icon={<Video />} title="Motion & Video" desc="4K timeline editor" />
                <FeatureItem icon={<Sparkles />} title="Nebula AI" desc="Unlimited generation" />
                <FeatureItem icon={<Layers />} title="Web UI Engine" desc="Prototype like a pro" />
             </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D946EF]/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#6366F1]/10 blur-3xl rounded-full" />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-left space-y-2">
      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-purple-400">
        {icon}
      </div>
      <h3 className="font-bold text-white uppercase text-xs tracking-wider">{title}</h3>
      <p className="text-zinc-500 text-sm">{desc}</p>
    </div>
  );
}
