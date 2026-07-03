import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal, Image as ImageIcon, Zap, Loader2, CheckSquare, AlertCircle, ChevronRight, Activity, RefreshCw,
  Gamepad2, TrendingUp, BookOpen, Film, Laptop, Mountain, Video, Box, Sparkles, Globe, Coffee, Palette, X, Heart, LayoutTemplate, Trash2,
  Ghost, Eye, MousePointerClick, Wand2, Target, Settings
} from 'lucide-react';
import { getThumbnailConcepts, generateThumbnailImage, refineConcept } from './services/gemini';
import { type StrategistResponse, type ThumbnailConcept, type ImageEditState } from './types';
import { ThumbnailConceptCard } from './components/ThumbnailConceptCard';
import { safeStorage } from './utils/storage';
import { getCTRScore } from './utils/scoring';

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
  { id: 'Review', icon: Box, title: 'Review', example: 'Clean, product-focused' },
  { id: 'Minimalist', icon: Palette, title: 'Minimalist', example: 'Aesthetic, highly curated' },
  { id: 'Viral', icon: Zap, title: 'Viral', example: 'Shock value, trending hooks' },
  { id: 'Tutorial', icon: BookOpen, title: 'Tutorial', example: 'Step-by-step, educational' },
];

const QUICK_STARTS = [
  {
    label: 'MrBeast Style',
    prompt: 'I gave $10,000 to a random stranger on the street',
    icon: Zap,
    niche: 'Entertainment', style: 'Adventure', palette: 'Vibrant', layout: 'Default',
  },
  {
    label: 'Before / After',
    prompt: 'I transformed my body in 30 days with no gym or diet',
    icon: RefreshCw,
    niche: 'Fitness', style: 'Documentary', palette: 'High Contrast', layout: 'Split Screen',
  },
  {
    label: 'Curiosity Gap',
    prompt: 'The one morning habit that changed my entire life',
    icon: Eye,
    niche: 'General', style: 'Documentary', palette: 'Dark Mode', layout: 'Default',
  },
  {
    label: 'High Stakes',
    prompt: 'I quit my 9-5 job and started a business with only $100',
    icon: Target,
    niche: 'Finance', style: 'Adventure', palette: 'Vibrant', layout: 'Default',
  },
  {
    label: 'Luxury vs Budget',
    prompt: '$10 vs $10,000 vacation — which one was actually better?',
    icon: TrendingUp,
    niche: 'Entertainment', style: 'Review', palette: 'High Contrast', layout: 'Split Screen',
  },
] as const;

const COGNITIVE_STEPS = [
  { text: "Analyzing visual psychology triggers...", icon: Eye },
  { text: "Optimizing color contrast for mobile...", icon: Palette },
  { text: "Engineering curiosity gap in composition...", icon: Sparkles },
  { text: "Validating text readability...", icon: MousePointerClick },
  { text: "Finalizing high-CTR layout...", icon: Target }
];

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: string;
  setAspectRatio: (v: string) => void;
  resolution: string;
  setResolution: (v: string) => void;
  saturation: number;
  setSaturation: (v: number) => void;
  onSelectKey: () => void;
}

const SettingsDrawer = ({
  isOpen, onClose,
  aspectRatio, setAspectRatio, resolution, setResolution, saturation, setSaturation,
  onSelectKey
}: SettingsDrawerProps) => {
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
          <div className="space-y-6">
            <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Fine-Tuning</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-label uppercase mb-2">Aspect Ratio</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3 bg-[var(--color-surface)] neo-border">
                  <option value="16:9">16:9 — YouTube</option>
                  <option value="9:16">9:16 — Shorts / TikTok</option>
                  <option value="1:1">1:1 — Square</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label uppercase mb-2">Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-3 bg-[var(--color-surface)] neo-border">
                  <option value="512px">512px — Fast preview</option>
                  <option value="1K">1K — Standard</option>
                  <option value="2K">2K — High quality</option>
                  <option value="4K">4K — Ultra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label uppercase mb-2">Saturation ({saturation}%)</label>
                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

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

  // Chat loop state
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [refiningConcepts, setRefiningConcepts] = useState<Record<number, boolean>>({});
  const [showRefinementFor, setShowRefinementFor] = useState<Record<number, boolean>>({});
  const [likedConcepts, setLikedConcepts] = useState<ThumbnailConcept[]>([]);
  const [selectedCompositeReferences, setSelectedCompositeReferences] = useState<Record<number, ThumbnailConcept[]>>({});
  const [mobilePreviewFor, setMobilePreviewFor] = useState<Record<number, boolean>>({});
  const [imageEdits, setImageEdits] = useState<Record<number, ImageEditState>>({});

  // UX state
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [showRestoreBar, setShowRestoreBar] = useState(false);

  // ── localStorage: check for saved session on mount ──────────────────────
  useEffect(() => {
    if (safeStorage.getItem('cyt_results')) setShowRestoreBar(true);
  }, []);

  // ── localStorage: auto-save on change ───────────────────────────────────
  useEffect(() => {
    if (results) {
      try { safeStorage.setItem('cyt_results', JSON.stringify(results)); } catch {}
    }
  }, [results]);

  useEffect(() => {
    try { safeStorage.setItem('cyt_liked', JSON.stringify(likedConcepts)); } catch {}
  }, [likedConcepts]);

  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(() => {
      safeStorage.setItem('cyt_input', input);
    }, 1000);
    return () => clearTimeout(timer);
  }, [input]);

  // ── API key check ────────────────────────────────────────────────────────

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const toggleLike = (concept: ThumbnailConcept) => {
    setLikedConcepts(prev => {
      const exists = prev.find(c => c.concept_name === concept.concept_name);
      if (exists) return prev.filter(c => c.concept_name !== concept.concept_name);
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
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const effectiveInput = overrideInput || input;
    if (!effectiveInput.trim()) return;

    setState('generating');
    setError(null);
    setChatInputs({});
    setShowRefinementFor({});
    setImageEdits({});
    setMobilePreviewFor({});
    setRefiningConcepts({});

    try {
      const concepts = await getThumbnailConcepts(effectiveInput, niche, stylePreset, layout, palette, base64Image || undefined, likedConcepts);
      setResults(concepts);

      const imageErrors: string[] = [];
      const updatedThumbnails = await Promise.all(
        concepts.thumbnails.map(async (concept) => {
          try {
            const prompt = includeFace
              ? `${concept.image_generation_prompt}, prominent expressive human face with clear emotion`
              : concept.image_generation_prompt;
            const imageUrl = await generateThumbnailImage(prompt, niche, stylePreset, layout, palette, aspectRatio, resolution, base64Image || undefined, saturation);
            return { ...concept, imageUrl };
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            imageErrors.push(`Concept ${concept.concept_number}: ${msg}`);
            if (msg.includes('Requested entity was not found')) setHasKey(false);
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
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes("API key not valid")) {
        setError("Invalid API Key. Please check your environment variables.");
      } else if (msg.includes("spending cap") || msg.includes("RESOURCE_EXHAUSTED")) {
        setError("Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.");
      } else {
        setError(`Failed to generate concepts: ${msg}`);
      }
      setState('initial');
    }
  };

  const handleGenerateMore = async () => {
    if (!input.trim() || !results) return;
    setIsGeneratingMore(true);
    setError(null);
    try {
      const more = await getThumbnailConcepts(input, niche, stylePreset, layout, palette, base64Image || undefined, likedConcepts);
      const offset = results.thumbnails.length;
      const withImages = await Promise.all(
        more.thumbnails.map(async (concept, i) => {
          const newNumber = offset + i + 1;
          try {
            const prompt = includeFace
              ? `${concept.image_generation_prompt}, prominent expressive human face with clear emotion`
              : concept.image_generation_prompt;
            const imageUrl = await generateThumbnailImage(prompt, niche, stylePreset, layout, palette, aspectRatio, resolution, base64Image || undefined, saturation);
            return { ...concept, concept_number: newNumber, imageUrl };
          } catch {
            return { ...concept, concept_number: newNumber };
          }
        })
      );
      setResults(prev => prev ? { ...prev, thumbnails: [...prev.thumbnails, ...withImages] } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate more concepts');
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleRegenerateImage = async (concept: ThumbnailConcept) => {
    if (!results) return;
    setRefiningConcepts(prev => ({ ...prev, [concept.concept_number]: true }));
    try {
      const prompt = includeFace
        ? `${concept.image_generation_prompt}, prominent expressive human face with clear emotion`
        : concept.image_generation_prompt;
      const imageUrl = await generateThumbnailImage(prompt, niche, stylePreset, layout, palette, aspectRatio, resolution, base64Image || undefined, saturation);
      setResults(prev => prev ? {
        ...prev,
        thumbnails: prev.thumbnails.map(t => t.concept_number === concept.concept_number ? { ...t, imageUrl } : t)
      } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image regeneration failed');
    } finally {
      setRefiningConcepts(prev => ({ ...prev, [concept.concept_number]: false }));
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
        return { ...prev, thumbnails: prev.thumbnails.map(t => t.concept_number === concept.concept_number ? updatedConcept : t) };
      });
      setChatInputs(prev => ({ ...prev, [concept.concept_number]: '' }));
      setShowRefinementFor(prev => ({ ...prev, [concept.concept_number]: false }));
    } catch (err) {
      console.error('Failed to refine concept', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes("spending cap") || msg.includes("RESOURCE_EXHAUSTED")) {
        setError("Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota.");
      } else {
        setError(`Failed to refine Concept ${concept.concept_number}: ${msg}`);
      }
    } finally {
      setRefiningConcepts(prev => ({ ...prev, [concept.concept_number]: false }));
    }
  };

  const handleNewSession = () => {
    setState('initial');
    setResults(null);
    setError(null);
    setChatInputs({});
    setShowRefinementFor({});
    setImageEdits({});
    setMobilePreviewFor({});
    setRefiningConcepts({});
    safeStorage.removeItem('cyt_results');
  };

  // ── Loading screen ───────────────────────────────────────────────────────
  if (hasKey === null) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-surface)] flex flex-col items-center justify-center p-6">
        <div className="bg-[var(--color-surface)] neo-card p-10 max-w-md w-full text-center space-y-6 neo-shadow-card">
          <div className="w-16 h-16 bg-[var(--color-secondary-yellow)] flex items-center justify-center mx-auto mb-4 neo-border neo-doodle-radius">
            <Sparkles className="w-8 h-8 text-[var(--color-on-surface)]" />
          </div>
          <h2 className="text-4xl font-headline tracking-tight">API Key Required</h2>
          <p className="text-[var(--color-on-surface)] text-2xl leading-relaxed font-body">
            To generate thumbnail concepts with Gemini and images with Minimax, you need to provide your own Google Cloud API key.
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

        {/* Backdrop */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
        )}

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

        {/* Session restore bar */}
        <AnimatePresence>
          {showRestoreBar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[var(--color-secondary-yellow)]/30 border-b-2 border-[var(--color-accent-pencil)]/10 overflow-hidden"
            >
              <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 opacity-50 shrink-0" />
                  <span className="text-xs font-label uppercase opacity-60">Previous session found</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      try {
                        const saved = safeStorage.getItem('cyt_results');
                        const savedLiked = safeStorage.getItem('cyt_liked');
                        const savedInput = safeStorage.getItem('cyt_input');
                        if (saved) { setResults(JSON.parse(saved)); setState('result'); }
                        if (savedLiked) setLikedConcepts(JSON.parse(savedLiked));
                        if (savedInput) setInput(savedInput);
                      } catch {}
                      setShowRestoreBar(false);
                    }}
                    className="px-3 py-1 bg-[var(--color-on-surface)] text-[var(--color-bg)] text-[10px] font-label uppercase neo-border hover:opacity-80 transition-opacity"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => {
                      safeStorage.removeItem('cyt_results');
                      safeStorage.removeItem('cyt_liked');
                      safeStorage.removeItem('cyt_input');
                      setShowRestoreBar(false);
                    }}
                    className="p-1 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border-b border-red-500/20"
            >
              <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between text-red-400 text-sm gap-4">
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
                    onClick={() => { if (state === 'initial') handleGenerate(); else setError(null); }}
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

        {/* ── INITIAL STATE ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {state === 'initial' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col"
            >
              {/* ── Single centered column ── */}
              <div className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-4xl mx-auto w-full gap-5">

              {/* Title */}
              <div className="w-full text-center">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-[var(--color-on-surface)] uppercase tracking-tighter leading-none">
                  Create Your <span className="text-[var(--color-primary)]">Thumbnail</span>
                </h2>
                <p className="mt-2 text-xs font-label uppercase tracking-widest opacity-40">Expert Strategy Engine</p>
              </div>

              {/* Liked References */}
              {likedConcepts.length > 0 && (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    <h3 className="text-sm font-headline text-[var(--color-on-surface)] uppercase tracking-widest opacity-70">Referenced Concepts</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {likedConcepts.map(concept => (
                      <div key={concept.concept_name} className="flex items-center gap-2 bg-[var(--color-surface)] neo-border p-1.5 pr-3 neo-shadow-button">
                        {concept.imageUrl && (
                          <img src={concept.imageUrl} alt={concept.concept_name} className="w-12 h-8 object-cover border-r-2 border-[var(--color-accent-pencil)]" referrerPolicy="no-referrer" />
                        )}
                        <span className="text-xs font-label text-[var(--color-on-surface)] uppercase">{concept.concept_name}</span>
                        <button onClick={() => toggleLike(concept)} className="text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CHATBOX ── */}
              <div className="neo-composer w-full flex flex-col group overflow-hidden p-4">
                {/* File pill */}
                {selectedImage && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] shadow-sm"
                    >
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[120px]">ref_img.jpg</span>
                      <button onClick={() => { setSelectedImage(null); setBase64Image(null); }} className="text-gray-400 hover:text-gray-600" title="Delete">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* Settings panels */}
                <AnimatePresence>
                  {layoutMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-4 bg-[var(--color-surface-container)] neo-border flex flex-col gap-3 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-label font-bold uppercase tracking-widest">Layout</span>
                        <div className="flex gap-3 items-center">
                          {layout !== 'Default' && <button onClick={() => setLayout('Default')} className="text-[9px] font-label uppercase opacity-40 hover:opacity-100 transition-opacity">Reset</button>}
                          <button onClick={() => setLayoutMode(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Default', 'Split Screen', 'Centered Subject', 'Grid'].map(l => (
                          <button key={l} onClick={() => { setLayout(l); setLayoutMode(false); }}
                            className={`px-3 py-1.5 text-[10px] font-label uppercase border-2 transition-all ${layout === l ? 'border-black bg-black text-white' : 'border-black/10 bg-[var(--color-surface)] text-[var(--color-on-surface)]/50 hover:border-black/30 hover:text-[var(--color-on-surface)]'}`}>
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
                      className="mb-3 p-4 bg-[var(--color-surface-container)] neo-border flex flex-col gap-3 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-label font-bold uppercase tracking-widest">Palette</span>
                        <div className="flex gap-3 items-center">
                          {palette !== 'Vibrant' && <button onClick={() => setPalette('Vibrant')} className="text-[9px] font-label uppercase opacity-40 hover:opacity-100 transition-opacity">Reset</button>}
                          <button onClick={() => setPaletteMode(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Vibrant', 'Minimalist', 'Dark Mode', 'High Contrast'].map(p => (
                          <button key={p} onClick={() => { setPalette(p); setPaletteMode(false); }}
                            className={`px-3 py-1.5 text-[10px] font-label uppercase border-2 transition-all ${palette === p ? 'border-black bg-black text-white' : 'border-black/10 bg-[var(--color-surface)] text-[var(--color-on-surface)]/50 hover:border-black/30 hover:text-[var(--color-on-surface)]'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subject preview */}
                <AnimatePresence>
                  {selectedImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 relative w-fit"
                    >
                      <div className="w-12 h-12 neo-border overflow-hidden bg-white neo-shadow-button">
                        <img src={selectedImage} alt="Subject Reference" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <button
                        onClick={() => { setSelectedImage(null); setBase64Image(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 neo-border hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your video concept..."
                  maxLength={2000}
                  className="w-full bg-transparent text-[var(--color-on-surface)] p-2 font-body text-lg focus:outline-none min-h-[48px] resize-none placeholder:text-[var(--color-on-surface)]/30 leading-relaxed transition-all duration-200 ease-in-out overflow-hidden"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />

                {/* Character counter */}
                <div className="flex justify-end pr-1 -mt-1 mb-1">
                  <span className={`text-[10px] font-mono transition-colors ${input.length > 1800 ? 'text-red-500 font-bold' : 'opacity-20'}`}>
                    {input.length}/2000
                  </span>
                </div>

                {/* Tool row */}
                <div className="flex items-center justify-between w-full pt-3 border-t border-[rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-2 py-1.5 transition-colors flex flex-col items-center gap-0.5 rounded-lg ${selectedImage ? 'bg-[var(--color-secondary-yellow)] text-black' : 'hover:bg-gray-100 text-gray-500'}`}
                      title="Upload a reference image"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">Photo</span>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput('');
                        if (selectedImage) URL.revokeObjectURL(selectedImage);
                        setSelectedImage(null);
                        setBase64Image(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        setLayout('Default');
                        setPalette('Vibrant');
                      }}
                      className="px-2 py-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex flex-col items-center gap-0.5 rounded-lg"
                      title="Clear everything"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">Clear</span>
                    </button>
                    <button
                      onClick={() => { setLayoutMode(!layoutMode); setPaletteMode(false); }}
                      className={`relative px-2 py-1.5 transition-colors flex flex-col items-center gap-0.5 rounded-lg ${layoutMode ? 'bg-gray-200 text-black' : 'hover:bg-gray-100 text-gray-500'}`}
                      title="Set composition layout"
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">Layout</span>
                      {layout !== 'Default' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />}
                    </button>
                    <button
                      onClick={() => setIncludeFace(!includeFace)}
                      className={`px-2 py-1.5 transition-colors flex flex-col items-center gap-0.5 rounded-lg ${!includeFace ? 'bg-[var(--color-secondary-yellow)] text-black' : 'hover:bg-gray-100 text-gray-500'}`}
                      title={includeFace ? "Face included — click to exclude" : "No face — click to include"}
                    >
                      <Ghost className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">{includeFace ? 'Face' : 'No Face'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setPaletteMode(!paletteMode); setLayoutMode(false); }}
                      className={`relative px-2 py-1.5 transition-colors flex flex-col items-center gap-0.5 rounded-lg ${paletteMode ? 'bg-gray-200 text-black' : 'hover:bg-gray-100 text-gray-500'}`}
                      title="Set color palette"
                    >
                      <Palette className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">Palette</span>
                      {palette !== 'Vibrant' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />}
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-2 py-1.5 hover:bg-gray-100 text-gray-500 transition-colors flex flex-col items-center gap-0.5 rounded-lg"
                      title="Image generation settings"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-[7px] font-label uppercase leading-none">Settings</span>
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={!input.trim()}
                      className="ml-1 bg-[var(--color-on-surface)] text-[var(--color-bg)] px-5 py-2 font-label text-sm hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-full"
                    >
                      Execute ◁
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Start Chips — each auto-configures niche/style/palette/layout */}
              <div className="w-full">
                <p className="text-[10px] font-label uppercase opacity-30 mb-2 tracking-widest text-center">Quick Start</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_STARTS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(chip.prompt);
                        setNiche(chip.niche);
                        setStylePreset(chip.style);
                        setPalette(chip.palette);
                        setLayout(chip.layout);
                        handleGenerate(undefined, chip.prompt);
                      }}
                      className="px-3 py-1.5 bg-[var(--color-surface)] neo-border neo-shadow-button hover:bg-[var(--color-secondary-yellow)] transition-all duration-200 flex items-center gap-1.5 font-label text-[10px] uppercase tracking-wider group"
                      title={`${chip.prompt} · ${chip.niche} · ${chip.style}`}
                    >
                      <chip.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              </div>{/* end hero: chatbox centered */}

              {/* ── Niche + Style — directly below hero ── */}
              <div className="px-6 pb-20 max-w-4xl mx-auto w-full">
              <div className="w-full pt-6 border-t-4 border-[var(--color-accent-pencil)]/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                  {/* Niche */}
                  <div className="space-y-5">
                    <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Target Niche</h3>
                    <div className="header-divider" />
                    <div className="grid grid-cols-2 gap-3">
                      {NICHE_EXAMPLES.map(n => {
                        const Icon = n.icon;
                        const active = niche === n.id;
                        return (
                          <button
                            key={n.id}
                            onClick={() => setNiche(n.id)}
                            className={`p-5 text-left transition-all duration-200 flex flex-col items-start gap-3 neo-card neo-shadow-button ${
                              active
                                ? 'bg-[var(--color-secondary-blue)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
                            }`}
                          >
                            <Icon className="w-7 h-7" />
                            <div>
                              <span className="font-headline text-lg font-bold uppercase block">{n.title}</span>
                              <span className="text-xs font-body mt-0.5 opacity-70 block">{n.example}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Style */}
                  <div className="space-y-5">
                    <h3 className="text-2xl font-headline text-[var(--color-on-surface)] uppercase tracking-widest">Style Preset</h3>
                    <div className="header-divider" />
                    <div className="grid grid-cols-2 gap-3">
                      {STYLE_EXAMPLES.map(s => {
                        const Icon = s.icon;
                        const active = stylePreset === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setStylePreset(s.id)}
                            className={`p-5 text-left transition-all duration-200 flex flex-col items-start gap-3 neo-card neo-shadow-button ${
                              active
                                ? 'bg-[var(--color-secondary-yellow)] text-[var(--color-on-surface)]'
                                : 'bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
                            }`}
                          >
                            <Icon className="w-7 h-7" />
                            <div>
                              <span className="font-headline text-lg font-bold uppercase block">{s.title}</span>
                              <span className="text-xs font-body mt-0.5 opacity-70 block">{s.example}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GENERATING STATE ───────────────────────────────────────────── */}
        <AnimatePresence>
          {state === 'generating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full mt-20 px-6"
            >
              <div className="w-full bg-[var(--color-surface)] neo-border neo-shadow-card p-10 relative overflow-hidden">
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
                        animate={{ opacity: idx <= loadingStepIndex ? 1 : 0.2, x: 0, scale: isActive ? 1.05 : 1 }}
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
                          <motion.div layoutId="active-indicator" className="ml-auto">
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

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

        {/* ── RESULT STATE ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {state === 'result' && results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto w-full px-6 py-12 space-y-12"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-[var(--color-primary)] flex items-center justify-center neo-border neo-shadow-button shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-[var(--color-on-primary)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-headline font-bold text-[var(--color-on-surface)] leading-tight">
                      {results.video_context_summary}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-label bg-[var(--color-secondary-blue)] text-white px-2.5 py-1 neo-border uppercase">{results.niche_applied}</span>
                      <span className="text-[10px] font-label bg-[var(--color-secondary-yellow)] text-[var(--color-on-surface)] px-2.5 py-1 neo-border uppercase">{results.style_preset_applied}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNewSession}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] neo-border neo-shadow-button font-label text-xs uppercase hover:bg-[var(--color-secondary-yellow)] transition-all shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  New Session
                </button>
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
                    handleRegenerateImage={handleRegenerateImage}
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

              {/* Generate More */}
              <div className="py-2">
                <button
                  onClick={handleGenerateMore}
                  disabled={isGeneratingMore}
                  className="w-full py-6 flex items-center justify-center gap-3 font-label uppercase text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed group border-2 border-dashed border-[var(--color-accent-pencil)]/20 hover:border-[var(--color-on-surface)] hover:bg-[var(--color-secondary-yellow)] bg-transparent"
                >
                  {isGeneratingMore ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating More Concepts...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Generate 3 More Concepts</>
                  )}
                </button>
              </div>

              {/* System Diagnostics Footer */}
              <div className="pb-16 border-t-4 border-[var(--color-accent-pencil)]">
                <div className="bg-[var(--color-surface)] neo-border neo-shadow-card p-10 flex flex-col md:flex-row items-center gap-8 relative mt-12">
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
