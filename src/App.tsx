import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Sparkles, 
  Trash2, 
  Download, 
  Palette,
  AlertCircle,
  Loader2,
  Share2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowDown,
  Maximize2,
  X,
  Copy,
  Check
} from 'lucide-react';
import { MoodSketch, GenerationStatus, PredefinedMoods, ART_STYLES } from './types';
import { refineMoodToPrompt, generateMoodSketch } from './services/pollinationsService';
import MoodChip from './components/MoodChip';

const MAX_GENERATIONS = 3;

const ARTIST_QUOTES = [
  { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso" },
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "I found I could say things with color and shapes that I couldn't say any other way.", author: "Georgia O'Keeffe" },
  { text: "Every artist dips his brush in his own soul.", author: "Henry Ward Beecher" },
  { text: "Color is the keyboard, the eyes are the hammers, the soul is the piano with many strings.", author: "Wassily Kandinsky" }
];

const PLACEHOLDER_PROMPTS = [
  "Dream here...", "Your canvas awaits", "Visualize the void", 
  "Awaiting inspiration", "Silence speaks", "Echoes of mood", 
  "Capture the unseen", "Space for soul"
];

const App: React.FC = () => {
  const [mood, setMood] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0].id);
  const [sketches, setSketches] = useState<MoodSketch[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [status, setStatus] = useState<GenerationStatus>({
    loading: false,
    error: null,
    count: 0
  });

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sketch-my-mood-history');
    const count = localStorage.getItem('sketch-my-mood-count');
    if (saved) setSketches(JSON.parse(saved));
    if (count) setStatus(prev => ({ ...prev, count: parseInt(count) }));
  }, []);

  useEffect(() => {
    localStorage.setItem('sketch-my-mood-history', JSON.stringify(sketches));
    localStorage.setItem('sketch-my-mood-count', status.count.toString());
  }, [sketches, status.count]);

  const handleGenerate = async () => {
    const finalMood = selectedMood || mood;
    if (!finalMood.trim()) {
      setStatus(prev => ({ ...prev, error: "Please express your mood first." }));
      return;
    }

    if (status.count >= MAX_GENERATIONS) {
      setStatus(prev => ({ ...prev, error: "You've reached your limit of 3 mood sketches." }));
      return;
    }

    setStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      const styleName = ART_STYLES.find(s => s.id === selectedStyle)?.name || 'Abstract';
      const { prompt: refined, colors } = await refineMoodToPrompt(finalMood, styleName);
      const imageUrl = await generateMoodSketch(refined, styleName);

      const newSketch: MoodSketch = {
        id: uuidv4(),
        originalMood: finalMood,
        refinedPrompt: refined,
        imageUrl,
        colors,
        style: styleName,
        timestamp: Date.now()
      };

      setSketches(prev => [newSketch, ...prev]);
      setStatus(prev => ({ ...prev, count: prev.count + 1, loading: false }));
      setMood('');
      setSelectedMood(null);
      
      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || "Failed to generate. Try again." 
      }));
    }
  };

  const EmptySlot: React.FC<{ index: number }> = ({ index }) => {
    const [textIndex, setTextIndex] = useState(Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length));
    const [fade, setFade] = useState(true);

    useEffect(() => {
      const timer = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
          setFade(true);
        }, 500);
      }, 4000 + (index * 500));

      return () => clearInterval(timer);
    }, [index]);

    return (
      <div className="aspect-square bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-gray-500 space-y-4 group hover:bg-white/[0.04] transition-colors cursor-default">
        <Palette className="w-12 h-12 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
        <p className={`text-xs uppercase tracking-widest font-bold transition-opacity duration-500 ${fade ? 'opacity-50' : 'opacity-0'}`}>
          {PLACEHOLDER_PROMPTS[textIndex]}
        </p>
      </div>
    );
  };

  const deleteSketch = (id: string) => setSketches(prev => prev.filter(s => s.id !== id));

  const handleShare = async (sketch: MoodSketch) => {
    try {
      const response = await fetch(sketch.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `mood-sketch.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `My ${sketch.originalMood} Mood` });
      }
    } catch (err) { alert("Sharing failed. Please download the image."); }
  };

  const handleReset = () => {
    if (window.confirm("Wipe the archive and reset your attempts?")) {
      setSketches([]); // Clear visual gallery
      setStatus(prev => ({ ...prev, count: 0, error: null })); // Reset counter logic
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: Scroll up
    }
  };

  const copyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const nextQuote = () => setQuoteIndex((prev) => (prev + 1) % ARTIST_QUOTES.length);
  const prevQuote = () => setQuoteIndex((prev) => (prev - 1 + ARTIST_QUOTES.length) % ARTIST_QUOTES.length);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      
      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img src={lightboxImage} alt="Full Screen" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Hero Section - CHANGED: min-h-screen instead of h-screen, added padding top/bottom */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
        </div>

        <nav className="absolute top-0 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center p-6 md:p-8 z-10 gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-serif font-bold tracking-tight">SketchMyMood</h1>
          </div>
          <div className={`text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full border backdrop-blur-md transition-all ${
            status.count >= MAX_GENERATIONS 
              ? 'text-red-300 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
              : 'text-gray-400 border-white/10 bg-white/5'
          }`}>
            {status.count >= MAX_GENERATIONS 
              ? "Reset gallery for more attempts" 
              : `${MAX_GENERATIONS - status.count} attempts left`
            }
          </div>
        </nav>

        <div className="relative z-10 text-center max-w-4xl space-y-8 md:space-y-12 mt-10 md:mt-0">
          <div className="space-y-4 md:space-y-6">
            {/* CHANGED: Smaller text on mobile */}
            <h2 className="text-4xl md:text-8xl font-serif leading-none tracking-tight">
              Paint your <span className="italic text-gray-500 underline decoration-gray-800">emotions</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed px-4">
              An AI-driven sanctuary where your feelings become visual masterpieces.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl space-y-6 md:space-y-8 w-full">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Artistic Movement
                </label>
                <div className="flex flex-wrap gap-2">
                  {ART_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all border ${
                        selectedStyle === style.id 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {style.icon} {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Emotional Anchors</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(PredefinedMoods).map(m => (
                    <MoodChip 
                      key={m} label={m} isActive={selectedMood === m}
                      onClick={() => { setSelectedMood(m); setMood(''); setStatus(p => ({ ...p, error: null })); }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={mood}
                onChange={(e) => { setMood(e.target.value); setSelectedMood(null); setStatus(p => ({ ...p, error: null })); }}
                disabled={status.loading}
                placeholder="Describe the texture of your heart today..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-6 text-white placeholder-gray-600 focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all resize-none text-base md:text-lg"
              />
              {status.error && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-red-400 text-xs animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>{status.error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={status.loading || status.count >= MAX_GENERATIONS}
              className="w-full h-14 md:h-16 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50 text-lg md:text-xl group"
            >
              {status.loading ? (
                <><Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> Weaving...</>
              ) : (
                <><Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" /> Generate Sketch</>
              )}
            </button>
          </div>
        </div>

        <button 
          onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-6 animate-bounce text-gray-500 hover:text-white transition-colors hidden md:block"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </section>

      {/* Gallery Section - CHANGED: reduced padding */}
      <section ref={galleryRef} className="py-16 md:py-32 px-6 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">The Archive</h3>
            {/* CHANGED: Text size responsive */}
            <h2 className="text-3xl md:text-5xl font-serif italic">Mood Gallery</h2>
          </div>
          
          {sketches.length > 0 && (
            <button 
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-red-400 flex items-center gap-2 uppercase tracking-widest font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Reset Collection
            </button>
          )}
        
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {sketches.map((sketch) => (
            <div key={sketch.id} className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-black cursor-pointer" onClick={() => setLightboxImage(sketch.imageUrl)}>
                <img src={sketch.imageUrl} alt={sketch.originalMood} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-[2px]" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setLightboxImage(sketch.imageUrl)} className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/10" title="View Fullscreen">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleShare(sketch)} className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/10" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <a href={sketch.imageUrl} download={`sketch-my-mood-${sketch.timestamp}.png`} className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/10" title="Download">
                    <Download className="w-5 h-5" />
                  </a>
                  <button onClick={() => deleteSketch(sketch.id)} className="p-3 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-all border border-red-500/20" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-lg font-serif italic text-gray-200">"{sketch.originalMood}"</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{sketch.style} Movement</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">Emotional DNA</p>
                  <div className="flex h-1.5 w-full rounded-full overflow-hidden">
                    {sketch.colors.map((color, idx) => (
                      <div key={idx} className="h-full flex-1 transition-transform hover:scale-y-[3] cursor-help" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>
                <div className="group/text relative">
                  <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {sketch.refinedPrompt}
                  </p>
                  <button onClick={() => copyPrompt(sketch.refinedPrompt, sketch.id)} className="absolute -right-2 -top-2 p-1.5 text-gray-600 hover:text-white transition-colors opacity-0 group-hover/text:opacity-100" title="Copy Prompt">
                    {copiedId === sketch.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {status.loading && (
            <div className="aspect-square bg-white/[0.05] border border-white/20 rounded-[2rem] overflow-hidden animate-pulse flex flex-col items-center justify-center p-12 space-y-6">
              <Loader2 className="w-12 h-12 text-white/20 animate-spin" />
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white w-full animate-[progress_3s_infinite] origin-left"></div>
              </div>
              <p className="text-xs text-center text-gray-500 uppercase tracking-widest font-bold">Developing...</p>
            </div>
          )}

          {[...Array(Math.max(0, MAX_GENERATIONS - sketches.length - (status.loading ? 1 : 0)))].map((_, i) => (
            <EmptySlot key={`empty-${i}`} index={i} />
          ))}
        
        </div>
      </section>

      {/* Features & Artist Quotes Section - CHANGED: reduced padding */}
      <section className="py-16 md:py-32 bg-[#080808] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">The Experience</h3>
                <h2 className="text-4xl md:text-5xl font-serif">A dialogue between <br/><span className="italic text-gray-400">Emotion & AI</span></h2>
              </div>
              
              <div className="grid gap-8">
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-medium">Poetic Refinement</h4>
                    <p className="text-gray-500 leading-relaxed">Our system doesn't just generate images; it understands context, refining your mood into complex poetic prompts.</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-medium">Emotional DNA</h4>
                    <p className="text-gray-500 leading-relaxed">Each sketch extracts a unique color palette—the visual fingerprint of your emotional state at this moment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white/5 border border-white/10 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] text-center space-y-8 overflow-hidden">
               <div className="absolute top-0 left-0 p-8 opacity-10">
                 <Quote className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-6">
                  <p className="text-2xl md:text-3xl font-serif italic text-gray-200 leading-relaxed min-h-[140px] flex items-center justify-center">
                    "{ARTIST_QUOTES[quoteIndex].text}"
                  </p>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                    — {ARTIST_QUOTES[quoteIndex].author}
                  </p>
                  <div className="flex justify-center gap-4 pt-8">
                    <button onClick={prevQuote} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextQuote} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-24 border-t border-white/5 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 opacity-50">
          <Palette className="w-5 h-5" />
          <p className="text-sm font-serif italic">Every artist was first an amateur.</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">© 2025 SketchMyMood • Powered by pollinations.ai</p>
      </footer>

      <style>{`
        @keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #222; }
      `}</style>
    </div>
  );
};

export default App;