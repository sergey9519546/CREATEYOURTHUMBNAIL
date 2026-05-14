import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Image as ImageIcon, Zap, Loader2, CheckSquare, Square, AlertCircle, ChevronRight, Activity, RefreshCw,
  Gamepad2, TrendingUp, BookOpen, Film, Laptop, Mountain, Video, Box, Send, Sparkles, Globe, Coffee, Palette, X, Lightbulb, Heart, Plus, LayoutTemplate, Trash2,
  Ghost, Eye, MousePointerClick, Wand2, Scissors, Paintbrush, Target, Settings, MessageSquare, Smartphone, Download
} from 'lucide-react';
import { getThumbnailConcepts, generateThumbnailImage, refineConcept, StrategistResponse, ThumbnailConcept } from './services/gemini';
import { ThumbnailConceptCard } from './components/ThumbnailConceptCard';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

type AppState = 'initial' | 'generating' | 'result';

const NICHE_EXAMPLES = [
  { id: 'General', icon: Globe, title: 'General', example: 'Vlogs, Storytime' },
  { id: 'Gaming', icon: Gamepad2, title: 'Gaming', example: 'Let\'s Plays, Esports' },
  { id: 'Finance', icon: TrendingUp, title: 'Finance', example: 'Crypto, Investing' },
  { id: 'Fitness', icon: Activity, title: 'Fitness', example: 'Workouts, Diets' },
  { id: 'Education', icon: BookOpen, title: 'Education', example: 'How-tos, Courses' },
  { id: 'Entertainment', icon: Film, title: 'Entertainment', example: 'Reactions, Gossip' },
  { id: 'Tech', icon: Laptop, title: 'Tech', example: 'Gadgets, Software' },
  { id: 'Food', icon: Coffee, title: 'Food', example: 'Cooking, Reviews' },
];

const STYLE_EXAMPLES = [
  { id: 'Adventure', icon: Mountain, title: 'Adventure', example: 'High energy, extreme stakes' },
  { id: 'Documentary', icon: Video, title: 'Documentary', example: 'Cinematic, narrative-driven' },
  { id: 'Review', icon: Box, title: 'Tech Review', example: 'Clean, product-focused' },
  { id: 'Minimalist', icon: Palette, title: 'Minimalist', example: 'Aesthetic, highly curated' },
];

const COGNITIVE_STEPS = [
  { text: "Analyzing visual psychology triggers...", icon: Eye },
  { text: "Optimizing color contrast for mobile...", icon: Palette },
  { text: "Engineering curiosity gap in composition...", icon: Sparkles },
  { text: "Validating text readability...", icon: MousePointerClick },
  { text: "Finalizing high-CTR layout...", icon: Target }
];

const SettingsDrawer = ({
  isOpen, onClose,
  aspectRatio, setAspectRatio, resolution, setResolution, saturation, setSaturation,
  onSelectKey
}: any) => {
  return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        className="fixed inset-y-0 right-0 z-50 bg-[var(--color-bg)] p-6 overflow-y-auto w-full md:w-80 md:border-l md:border-[var(--color-surface-container)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold uppercase">Settings</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="space-y-12">
          {/* Fine-tuning */}
          <div className="space-y-6">
            <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Fine-Tuning</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-label uppercase mb-2">Aspect Ratio</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3 bg-[var(--color-surface)] neo-border">
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label uppercase mb-2">Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-3 bg-[var(--color-surface)] neo-border">
                  <option value="512px">512px</option>
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label uppercase mb-2">Saturation ({saturation}%)</label>
                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* API Key Management */}
          <div className="space-y-6">
            <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Account</h3>
            <button 
              onClick={onSelectKey}
              className="w-full p-4 bg-[var(--color-secondary-yellow)] text-[var(--color-on-surface)] font-label uppercase neo-border neo-shadow-button hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Change API Key
            </button>
            <p className="text-xs text-[var(--color-on-surface)] opacity-60 font-body">
              Switch to a different Google Cloud project if you've reached your spending cap.
            </p>
          </div>
        </div>
      </motion.div>
  );
};

export default function App() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  const [niche, setNiche] = useState(NICHE_EXAMPLES[0].id);
  const [stylePreset, setStylePreset] = useState(STYLE_EXAMPLES[0].id);
  const [includeFace, setIncludeFace] = useState(true);
  const [state, setState] = useState<AppState>('initial');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [results, setResults] = useState<StrategistResponse | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [layout, setLayout] = useState('Default');
  const [palette, setPalette] = useState('Vibrant');
  const [layoutMode, setLayoutMode] = useState(false);
  const [paletteMode, setPaletteMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('2K');
  const [saturation, setSaturation] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat Loop State
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [refiningConcepts, setRefiningConcepts] = useState<Record<number, boolean>>({});
  const [showRefinementFor, setShowRefinementFor] = useState<Record<number, boolean>>({});
  const [likedConcepts, setLikedConcepts] = useState<ThumbnailConcept[]>([]);
  const [selectedCompositeReferences, setSelectedCompositeReferences] = useState<Record<number, ThumbnailConcept[]>>({});
  const [mobilePreviewFor, setMobilePreviewFor] = useState<Record<number, boolean>>({});
  const [imageEdits, setImageEdits] = useState<Record<number, { 
    brightness: number, 
    contrast: number, 
    saturation: number,
    subjectSize: number,
    textPosition: 'top' | 'center' | 'bottom',
    emphasis: 'subject' | 'text' | 'balanced'
  }>>({});

  const getCTRScore = (concept: ThumbnailConcept) => {
    // Mocked CTR score based on strategist logic
    let score = 85;
    if (concept.hook.toLowerCase().includes('curiosity')) score += 5;
    if (concept.psychology.toLowerCase().includes('shock')) score += 3;
    if (concept.text_overlay.split(' ').length <= 4) score += 5;
    return Math.min(score, 99);
  };

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback if not in AI Studio
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success to mitigate race condition
    }
  };

  const toggleLike = (concept: ThumbnailConcept) => {
    setLikedConcepts(prev => {
      const exists = prev.find(c => c.concept_name === concept.concept_name);
      if (exists) {
        return prev.filter(c => c.concept_name !== concept.concept_name);
      }
      return [...prev, concept];
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'generating') {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev < COGNITIVE_STEPS.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL to prevent memory leak
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

      // For backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setState('generating');
    setError(null);
    setChatInputs({});
    setShowRefinementFor({});

    try {
      const concepts = await getThumbnailConcepts(input, niche, stylePreset, layout, palette, base64Image || undefined, likedConcepts);
      setResults(concepts);
      
      let imageErrors: string[] = [];

      const updatedThumbnails = await Promise.all(
        concepts.thumbnails.map(async (concept) => {
          try {
            const prompt = includeFace 
              ? `${concept.image_generation_prompt}, prominent expressive human face with clear emotion`
              : concept.image_generation_prompt;
            const imageUrl = await generateThumbnailImage(prompt, niche, stylePreset, layout, palette, aspectRatio, resolution, base64Image || undefined, saturation);
            return { ...concept, imageUrl };
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`Failed to generate image for concept ${concept.concept_number}`, err);
            
            if (errorMessage.includes("spending cap") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
              imageErrors.push(`Concept ${concept.concept_number}: Gemini API Quota Exceeded. Check your Google Cloud billing settings.`);
            } else {
              imageErrors.push(`Concept ${concept.concept_number}: ${errorMessage}`);
            }
            
            // If it's a missing entity error, reset key state
            if (errorMessage.includes('Requested entity was not found')) {
              setHasKey(false);
            }
            
            return concept;
          }
        })
      );

      if (imageErrors.length > 0) {
        setError(`Image generation partially failed. ${imageErrors.join(' | ')}`);
      }

      setResults({ ...concepts, thumbnails: updatedThumbnails });
      setState('result');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes("API key not valid")) {
        setError("Invalid API Key. Please check your environment variables.");
      } else if (errorMessage.includes("spending cap") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        setError("Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.");
      } else {
        setError(`Failed to generate concepts: ${errorMessage}`);
      }
      setState('initial');
    }
  };

  const handleRefine = async (concept: ThumbnailConcept, feedbackOverride?: string) => {
    const feedback = feedbackOverride || chatInputs[concept.concept_number];
    if (!feedback || !feedback.trim() || !results) return;

    setRefiningConcepts(prev => ({ ...prev, [concept.concept_number]: true }));
    setError(null);
    
    try {
      const compositeReferences = selectedCompositeReferences[concept.concept_number] || [];
      const refinedConcept = await refineConcept(concept, feedback, compositeReferences, base64Image || undefined);
      const prompt = includeFace 
        ? `${refinedConcept.image_generation_prompt}, prominent expressive human face with clear emotion`
        : refinedConcept.image_generation_prompt;
      const imageUrl = await generateThumbnailImage(prompt, niche, stylePreset, layout, palette, aspectRatio, resolution, base64Image || undefined, saturation);
      const updatedConcept = { ...refinedConcept, imageUrl };

      setResults(prev => {
        if (!prev) return prev;
        const newThumbnails = prev.thumbnails.map(t => 
          t.concept_number === concept.concept_number ? updatedConcept : t
        );
        return { ...prev, thumbnails: newThumbnails };
      });
      
      setChatInputs(prev => ({ ...prev, [concept.concept_number]: '' }));
      setShowRefinementFor(prev => ({ ...prev, [concept.concept_number]: false }));
    } catch (err) {
      console.error('Failed to refine concept', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes("spending cap") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        setError("Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.");
      } else {
        setError(`Failed to refine Concept ${concept.concept_number}: ${errorMessage}`);
      }
    } finally {
      setRefiningConcepts(prev => ({ ...prev, [concept.concept_number]: false }));
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-surface)] flex flex-col items-center justify-center p-6">
        <div className="bg-[var(--color-surface)] neo-card p-10 max-w-md w-full text-center space-y-6 neo-shadow-card">
          <div className="w-16 h-16 bg-[var(--color-secondary-yellow)] flex items-center justify-center mx-auto mb-4 neo-border neo-doodle-radius">
            <Sparkles className="w-8 h-8 text-[var(--color-on-surface)]" />
          </div>
          <h2 className="text-4xl font-headline tracking-tight">API Key Required</h2>
          <p className="text-[var(--color-on-surface)] text-2xl leading-relaxed font-body">
            To generate high-quality 2K thumbnails with the advanced Gemini 3.1 Flash Image model, you need to provide your own Google Cloud API key.
          </p>
          <div className="text-xl text-[var(--color-on-surface)] bg-[var(--color-surface-container)] p-4 neo-card text-left font-body">
            <p className="mb-2">&gt; Note: You must select an API key from a paid Google Cloud project.</p>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[var(--color-secondary-blue)] hover:underline flex items-center gap-1 font-bold">
              <ChevronRight className="w-5 h-5" /> View Billing Documentation
            </a>
          </div>
          <button
            onClick={handleSelectKey}
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-label text-2xl py-4 hover:bg-[var(--color-primary-dim)] transition-colors neo-button neo-shadow-button uppercase tracking-widest"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--color-on-surface)] font-body flex flex-col selection:bg-[var(--color-secondary-yellow)] selection:text-[var(--color-on-surface)]">
      
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-[var(--color-bg)]">
        
        
        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          setResolution={setResolution}
          saturation={saturation}
          setSaturation={setSaturation}
          onSelectKey={handleSelectKey}
        />

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border-b border-red-500/20"
            >
              <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between text-red-400 text-sm gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" /> 
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-wider">API Error Detected</p>
                    <p className="opacity-90">{error}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {(error.includes("spending cap") || error.includes("Quota Exceeded")) && (
                    <div className="flex items-center gap-2">
                      <a 
                        href="https://console.cloud.google.com/billing" 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-red-500 text-white font-label uppercase text-xs neo-button neo-shadow-button hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Fix Billing
                      </a>
                      <button 
                        onClick={handleSelectKey}
                        className="px-4 py-2 bg-[var(--color-secondary-yellow)] text-[var(--color-on-surface)] font-label uppercase text-xs neo-border neo-shadow-button hover:bg-[var(--color-primary)] transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Change Project/Key
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      if (state === 'initial') handleGenerate();
                      else setError(null);
                    }} 
                    className="px-4 py-2 bg-[var(--color-surface)] text-[var(--color-on-surface)] font-label uppercase text-xs neo-border neo-shadow-button hover:bg-[var(--color-surface-container)] transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                  <button onClick={() => setError(null)} className="hover:text-red-300 transition-colors p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        <AnimatePresence mode="wait">
          {state === 'initial' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-5xl mx-auto flex flex-col px-6 py-8 md:py-12 flex-1 justify-center"
            >

              {/* Title */}
              <div className="max-w-2xl mx-auto w-full mb-12 text-center">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-[var(--color-on-surface)] uppercase tracking-tighter leading-none">
                  Create Your <br />
                  <span className="text-[var(--color-primary)]">Thumbnail</span>
                </h2>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="h-1 flex-1 bg-[var(--color-accent-pencil)]" />
                  <span className="text-sm font-label font-bold uppercase tracking-widest opacity-60">Expert Strategy Engine</span>
                  <div className="h-1 flex-1 bg-[var(--color-accent-pencil)]" />
                </div>
              </div>

              {/* Liked References */}
              {likedConcepts.length > 0 && (
                <div className="max-w-2xl mx-auto w-full mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-6 h-6 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    <h3 className="text-xl font-headline text-[var(--color-on-surface)] uppercase">Referenced Concepts</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {likedConcepts.map(concept => (
                      <div key={concept.concept_name} className="flex items-center gap-3 bg-[var(--color-surface)] neo-border p-2 pr-4 neo-shadow-button">
                        {concept.imageUrl && (
                          <img src={concept.imageUrl} alt={concept.concept_name} className="w-16 h-10 object-cover border-r-2 border-[var(--color-accent-pencil)]" referrerPolicy="no-referrer" />
                        )}
                        <span className="text-lg font-label text-[var(--color-on-surface)]">{concept.concept_name}</span>
                        <button 
                          onClick={() => toggleLike(concept)}
                          className="text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors ml-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Chat Input Box */}
              <div className="neo-composer max-w-2xl mx-auto w-full flex flex-col group mb-6 overflow-hidden p-4">
                {/* Layer A: File Pills */}
                {selectedImage && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] shadow-sm"
                    >
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[120px]">ref_img.jpg</span>
                      <button
                        onClick={() => { setSelectedImage(null); setBase64Image(null); }}
                        className="text-gray-400 hover:text-gray-600"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* Settings Panels */}
                <AnimatePresence>
                  {layoutMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-3 bg-gray-100 rounded-xl text-sm text-gray-700 border border-gray-200 flex flex-col gap-2 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Select Layout</span>
                        <div className="flex gap-2">
                          {layout !== 'Default' && (
                            <button onClick={() => setLayout('Default')} className="text-xs text-gray-500 hover:text-black">Reset</button>
                          )}
                          <button onClick={() => setLayoutMode(false)} className="text-gray-500 hover:text-black"><X className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Default', 'Split Screen', 'Centered Subject', 'Grid'].map(l => (
                          <button 
                            key={l}
                            onClick={() => {
                              setLayout(l);
                              setLayoutMode(false);
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${layout === l ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {paletteMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-3 bg-gray-100 rounded-xl text-sm text-gray-700 border border-gray-200 flex flex-col gap-2 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Select Palette</span>
                        <div className="flex gap-2">
                          {palette !== 'Vibrant' && (
                            <button onClick={() => setPalette('Vibrant')} className="text-xs text-gray-500 hover:text-black">Reset</button>
                          )}
                          <button onClick={() => setPaletteMode(false)} className="text-gray-500 hover:text-black"><X className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Vibrant', 'Minimalist', 'Dark Mode', 'High Contrast'].map(p => (
                          <button 
                            key={p}
                            onClick={() => {
                              setPalette(p);
                              setPaletteMode(false);
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${palette === p ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subject Upload Preview in Chatbox */}
                <AnimatePresence>
                  {selectedImage && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="mr-3 relative"
                    >
                      <div className="w-12 h-12 neo-border overflow-hidden bg-white neo-shadow-button">
                        <img 
                          src={selectedImage} 
                          alt="Subject Reference" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedImage(null);
                          setBase64Image(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 neo-border hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Layer B: Text Area */}
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your video concept..."
                  className="w-full bg-transparent text-[#1F1F1F] p-2 font-body text-lg focus:outline-none min-h-[48px] resize-none placeholder:text-gray-400 leading-relaxed transition-all duration-200 ease-in-out overflow-hidden"
                  disabled={state === 'generating'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                
                {/* Layer C: Tool Row */}
                <div className="flex items-center justify-between w-full pt-4 mt-2 border-t border-[rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    {/* Attachment Button */}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 transition-colors flex items-center justify-center rounded-lg ${selectedImage ? 'bg-[var(--color-secondary-yellow)] text-black' : 'hover:bg-gray-200 text-gray-600'}`}
                      title="Upload Subject/Character"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                    </button>
                    {/* Clear Button */}
                    <button 
                      type="button"
                      onClick={() => {
                        setInput('');
                        setSelectedImage(null);
                        setBase64Image(null);
                        setLayout('Default');
                        setPalette('Vibrant');
                      }}
                      className="p-2 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors flex items-center justify-center rounded-lg"
                      title="Clear All"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {/* Layout/Add Icon */}
                    <button
                      onClick={() => {
                        setLayoutMode(!layoutMode);
                        setPaletteMode(false);
                      }}
                      className={`relative p-2 transition-colors flex items-center justify-center rounded-lg ${layoutMode ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 text-gray-600'}`}
                      title="Toggle Layout Mode"
                    >
                      <LayoutTemplate className="w-5 h-5" />
                      {layout !== 'Default' && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />}
                    </button>
                    {/* Include Face Toggle */}
                    <button
                      onClick={() => setIncludeFace(!includeFace)}
                      className={`p-2 transition-colors flex items-center justify-center rounded-lg ${!includeFace ? 'bg-[var(--color-secondary-yellow)] text-black' : 'hover:bg-gray-200 text-gray-600'}`}
                      title={includeFace ? "Face included — click to disable" : "No face (ghost mode) — click to enable"}
                    >
                      <Ghost className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Settings Toggle */}
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-2 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center rounded-lg"
                      title="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    {/* Palette Icon */}
                    <button 
                      onClick={() => {
                        setPaletteMode(!paletteMode);
                        setLayoutMode(false);
                      }}
                      className={`relative p-2 transition-colors flex items-center justify-center rounded-lg ${paletteMode ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 text-gray-600'}`}
                      title="Toggle Palette Mode"
                    >
                      <Palette className="w-5 h-5" />
                      {palette !== 'Vibrant' && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />}
                    </button>

                    {/* Submit Button */}
                    <button 
                      onClick={handleGenerate}
                      disabled={!input.trim() || state === 'generating'}
                      className="bg-[#1F1F1F] text-white px-5 py-2 font-label text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-full"
                    >
                      <span>Execute ◁</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Start Chips - Moved Under Chatbox and Smaller */}
              <div className="mb-12 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {[
                  { label: "MrBeast Style", icon: Zap },
                  { label: "Before/After", icon: RefreshCw },
                  { label: "Curiosity Gap", icon: Eye },
                  { label: "High Stakes", icon: Target },
                  { label: "Luxury/Budget", icon: TrendingUp }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(chip.label)}
                    className="px-3 py-1.5 bg-[var(--color-surface)] neo-border neo-shadow-button hover:bg-[var(--color-secondary-yellow)] transition-all duration-300 flex items-center gap-2 font-label text-[10px] uppercase tracking-wider group"
                  >
                    <chip.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Symmetric Example Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto w-full pb-20 pt-12 border-t-4 border-[var(--color-accent-pencil)]/10">
                {/* Niche Grid */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4">
                    <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Target Niche</h3>
                  </div>
                  <div className="header-divider" />
                  <div className="grid grid-cols-2 gap-4">
                    {NICHE_EXAMPLES.map(n => {
                      const Icon = n.icon;
                      const isSelected = niche === n.id;
                      return (
                        <button
                          key={n.id}
                          onClick={() => setNiche(n.id)}
                          className={`p-6 text-left transition-all duration-200 flex flex-col items-start gap-4 neo-card neo-shadow-button ${
                            isSelected 
                              ? 'bg-[var(--color-secondary-blue)] text-white' 
                              : 'bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
                          }`}
                        >
                          <div className={`mt-1 ${isSelected ? 'text-white' : 'text-[var(--color-on-surface)]'}`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-headline text-xl font-bold uppercase">{n.title}</span>
                            <span className="text-sm font-body mt-1 opacity-70">{n.example}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Style Grid */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4">
                    <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Style Preset</h3>
                  </div>
                  <div className="header-divider" />
                  <div className="grid grid-cols-1 gap-4">
                    {STYLE_EXAMPLES.map(s => {
                      const Icon = s.icon;
                      const isSelected = stylePreset === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setStylePreset(s.id)}
                          className={`p-6 text-left transition-all duration-200 flex items-center gap-4 neo-card neo-shadow-button ${
                            isSelected 
                              ? 'bg-[var(--color-secondary-yellow)] text-[var(--color-on-surface)]' 
                              : 'bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
                          }`}
                        >
                          <div className={`mt-1 ${isSelected ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface)]'}`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-headline text-xl font-bold uppercase">{s.title}</span>
                            <span className="text-lg font-body mt-1">{s.example}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generating State */}
        <AnimatePresence>
          {state === 'generating' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full mt-20 px-6"
            >
              <div className="w-full bg-[var(--color-surface)] neo-border neo-shadow-card p-10 relative overflow-hidden">
                {/* Quirky Background Elements */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-64 h-64 border-4 border-dashed border-[var(--color-accent-pencil)] opacity-10 rounded-full"
                />
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-secondary-yellow)] opacity-10 rounded-full"
                />

                <div className="text-center mb-12 relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-4 bg-[var(--color-primary)] neo-border neo-shadow-button mb-6"
                  >
                    <Wand2 className="w-10 h-10 text-[var(--color-on-primary)]" />
                  </motion.div>
                  <h2 className="text-4xl font-headline font-bold text-[var(--color-on-surface)] uppercase tracking-tighter">
                    Strategist is Cooking...
                  </h2>
                  <p className="text-xl font-body text-[var(--color-on-surface)]/70 mt-2">
                    Packaging your next viral hit.
                  </p>
                </div>

                <div className="space-y-6 relative z-10">
                  {COGNITIVE_STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = idx === loadingStepIndex;
                    const isCompleted = idx < loadingStepIndex;
                    
                    return (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: idx <= loadingStepIndex ? 1 : 0.2,
                          x: 0,
                          scale: isActive ? 1.05 : 1
                        }}
                        className={`flex items-center gap-5 p-4 neo-border transition-all duration-300 ${
                          isActive ? 'bg-[var(--color-secondary-yellow)] neo-shadow-button' : 
                          isCompleted ? 'bg-[var(--color-surface-container)] opacity-60' : 'bg-transparent'
                        }`}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center neo-border ${
                          isActive ? 'bg-white' : isCompleted ? 'bg-[var(--color-secondary-blue)] text-white' : 'bg-white/50'
                        }`}>
                          {isCompleted ? <CheckSquare className="w-6 h-6" /> : <StepIcon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />}
                        </div>
                        <span className={`text-xl font-label uppercase tracking-tight ${isActive ? 'font-bold' : ''}`}>
                          {step.text}
                        </span>
                        {isActive && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="ml-auto"
                          >
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mt-12 h-4 w-full bg-[var(--color-surface-container)] neo-border overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((loadingStepIndex + 1) / COGNITIVE_STEPS.length) * 100}%` }}
                    className="h-full bg-[var(--color-primary)]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result State */}
        <AnimatePresence>
          {state === 'result' && results && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto w-full px-6 py-12 space-y-12"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--color-primary)] flex items-center justify-center neo-border neo-shadow-button">
                      <Sparkles className="w-6 h-6 text-[var(--color-on-primary)]" />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-headline font-bold text-[var(--color-on-surface)] leading-tight">
                      {results.video_context_summary}
                    </h3>
                  </div>
                  <p className="text-2xl text-[var(--color-on-surface)] leading-relaxed max-w-3xl font-body">"{input}"</p>
                </div>
                
                <div className="flex flex-col gap-4 bg-[var(--color-surface)] neo-border neo-shadow-card p-6 min-w-[240px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-label text-[var(--color-on-surface)] uppercase opacity-60">Target Niche</span>
                    <span className="text-sm font-label font-bold text-[var(--color-on-primary)] bg-[var(--color-secondary-blue)] neo-border px-3 py-1 uppercase inline-block w-fit">{results.niche_applied}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-label text-[var(--color-on-surface)] uppercase opacity-60">Style Preset</span>
                    <span className="text-sm font-label font-bold text-[var(--color-on-surface)] bg-[var(--color-secondary-yellow)] neo-border px-3 py-1 uppercase inline-block w-fit">{results.style_preset_applied}</span>
                  </div>
                </div>
              </div>

              {/* Concepts Feed */}
              <div className="space-y-12">
                {results.thumbnails.map((concept, idx) => (
                  <ThumbnailConceptCard
                    key={concept.concept_number}
                    concept={concept}
                    idx={idx}
                    mobilePreviewFor={mobilePreviewFor}
                    setMobilePreviewFor={setMobilePreviewFor}
                    imageEdits={imageEdits}
                    setImageEdits={setImageEdits}
                    refiningConcepts={refiningConcepts}
                    getCTRScore={getCTRScore}
                    handleRefine={handleRefine}
                    setResults={setResults}
                    toggleLike={toggleLike}
                    likedConcepts={likedConcepts}
                    chatInputs={chatInputs}
                    setChatInputs={setChatInputs}
                    showRefinementFor={showRefinementFor}
                    setShowRefinementFor={setShowRefinementFor}
                  />
                ))}
              </div>

              {/* System Advice Footer */}
              <div className="pt-12 pb-24 border-t-4 border-[var(--color-accent-pencil)]">
                <div className="bg-[var(--color-surface)] neo-border neo-shadow-card p-10 flex flex-col md:flex-row items-center gap-8 relative">
                  <div className="w-20 h-20 bg-[var(--color-secondary-blue)] neo-border flex items-center justify-center shrink-0 neo-shadow-button">
                    <Terminal className="w-10 h-10 text-[var(--color-on-primary)]" />
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-2xl font-headline font-bold text-[var(--color-on-surface)] uppercase">System Diagnostics & Advice</h5>
                    <p className="text-3xl text-[var(--color-on-surface)] leading-relaxed font-body">"{results.chat_prompt}"</p>
                    <p className="text-xl text-[var(--color-on-surface)] leading-relaxed font-body">{results.optimization_notes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

