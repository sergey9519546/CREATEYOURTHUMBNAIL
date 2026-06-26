import React from 'react';
import { motion } from 'motion/react';
import { X, Smartphone, Download, Loader2, Zap, Activity, LayoutTemplate, MessageSquare, Palette, TrendingUp, Target, Box, RefreshCw, Heart, Send, Wand2, Copy, AlertCircle } from 'lucide-react';
import { ThumbnailConcept, ImageEditState, StrategistResponse } from '../types';
import { getCTRScore } from '../utils/scoring';

const getRefinementSuggestions = (hook: string, psychology: string): string[] => {
  const h = hook.toLowerCase();
  const p = psychology.toLowerCase();
  const suggestions: Set<string> = new Set();

  if (p.includes('curiosity') && h.includes('number')) {
    suggestions.add("Make the number glow to increase focus");
    suggestions.add("Use a '?' instead of a digit to amplify mystery");
    suggestions.add("Partially obscure the number to create a curiosity gap");
    suggestions.add("Use a 3D extruded font for the number for visual weight");
    suggestions.add("Add a 'censored' bar over the number");
  } else if (p.includes('fear') && h.includes('comparison')) {
    suggestions.add("Make the 'bad' side darker to increase contrast");
    suggestions.add("Add a warning sign to the 'bad' side");
    suggestions.add("Use a red tint on the 'bad' side for urgency");
    suggestions.add("Make the 'good' side brighter to enhance the contrast");
  } else if (p.includes('joy') && h.includes('storytelling')) {
    suggestions.add("Add a bright, happy background");
    suggestions.add("Make the subject's expression more ecstatic");
    suggestions.add("Use vibrant, warm colors to boost energy");
    suggestions.add("Add a 'happy' narrative element to the background");
  }

  if (p.includes('curiosity') || p.includes('mystery')) {
    suggestions.add("Add a '?' to the text to drive clicks");
    suggestions.add("Blur the background more to push the subject forward");
    suggestions.add("Make the main subject look surprised");
    suggestions.add("Add a hidden object in the background");
  } else if (p.includes('fear') || p.includes('urgency')) {
    suggestions.add("Add a red border for urgency");
    suggestions.add("Make the text bolder and more aggressive");
    suggestions.add("Add a warning icon");
    suggestions.add("Increase contrast for a starker, more dramatic look");
  } else if (p.includes('joy') || p.includes('excitement')) {
    suggestions.add("Increase color saturation to 100%");
    suggestions.add("Add a smiling face with closed mouth (MrBeast strategy)");
    suggestions.add("Make the lighting brighter and more positive");
    suggestions.add("Add confetti or sparkles for energy");
  } else if (p.includes('controversy')) {
    suggestions.add("Use a more confrontational pose");
    suggestions.add("Add a 'vs' element");
    suggestions.add("Use high-contrast, aggressive typography");
  }

  if (h.includes('comparison') || h.includes('versus')) {
    suggestions.add("Add a split-screen divider for clear story separation");
    suggestions.add("Enhance the 'after' contrast");
    suggestions.add("Make the 'before' desaturated");
    suggestions.add("Use a 'before' and 'after' label");
  } else if (h.includes('storytelling') || h.includes('narrative')) {
    suggestions.add("Add a narrative element to the background");
    suggestions.add("Make the subject look more expressive");
    suggestions.add("Adjust lighting to focus on the subject");
    suggestions.add("Add a background element that tells a story");
  } else if (h.includes('authority') || h.includes('expert')) {
    suggestions.add("Add a professional badge or icon");
    suggestions.add("Make the text cleaner and more authoritative");
    suggestions.add("Adjust lighting for a studio look");
    suggestions.add("Use a more formal, clean background");
  } else if (h.includes('listicle')) {
    suggestions.add("Add a number badge for scannability");
    suggestions.add("Use a grid layout for items");
    suggestions.add("Make the text more scannable and bold");
  }

  if (suggestions.size === 0) {
    suggestions.add("Increase text size for mobile readability");
    suggestions.add("Boost subject brightness by 20%");
    suggestions.add("Simplify the background to reduce noise");
    suggestions.add("Add more detail to the primary subject");
    suggestions.add("Use a more vibrant, high-contrast color palette");
  }

  return Array.from(suggestions).slice(0, 6);
};

interface ThumbnailConceptCardProps {
  concept: ThumbnailConcept;
  idx: number;
  mobilePreviewFor: Record<number, boolean>;
  setMobilePreviewFor: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  imageEdits: Record<number, Partial<ImageEditState>>;
  setImageEdits: React.Dispatch<React.SetStateAction<Record<number, Partial<ImageEditState>>>>;
  refiningConcepts: Record<number, boolean>;
  handleRefine: (concept: ThumbnailConcept, feedback?: string) => void;
  handleRegenerateImage: (concept: ThumbnailConcept) => void;
  setResults: React.Dispatch<React.SetStateAction<StrategistResponse | null>>;
  toggleLike: (concept: ThumbnailConcept) => void;
  likedConcepts: ThumbnailConcept[];
  chatInputs: Record<number, string>;
  setChatInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  showRefinementFor: Record<number, boolean>;
  setShowRefinementFor: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export const ThumbnailConceptCard: React.FC<ThumbnailConceptCardProps> = ({
  concept, idx, mobilePreviewFor, setMobilePreviewFor, imageEdits, setImageEdits,
  refiningConcepts, handleRefine, handleRegenerateImage, setResults,
  toggleLike, likedConcepts, chatInputs, setChatInputs, showRefinementFor, setShowRefinementFor
}) => {
  const [copied, setCopied] = React.useState(false);

  const updateImageEdit = (conceptNumber: number, updates: Partial<ImageEditState>) => {
    setImageEdits(prev => ({
      ...prev,
      [conceptNumber]: {
        ...prev[conceptNumber],
        brightness: prev[conceptNumber]?.brightness || 0,
        contrast: prev[conceptNumber]?.contrast || 0,
        saturation: prev[conceptNumber]?.saturation || 0,
        subjectSize: prev[conceptNumber]?.subjectSize || 5,
        textPosition: prev[conceptNumber]?.textPosition || 'center',
        emphasis: prev[conceptNumber]?.emphasis || 'balanced',
        ...updates
      }
    }));
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(concept.image_generation_prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const isLiked = likedConcepts.some(c => c.concept_name === concept.concept_name);
  const suggestions = getRefinementSuggestions(concept.hook || '', concept.psychology || '');
  const chatInput = chatInputs[concept.concept_number] || '';
  const showRefinement = showRefinementFor[concept.concept_number] || false;
  const isRefining = refiningConcepts[concept.concept_number] || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.15 }}
      className="bg-[var(--color-surface)] neo-card neo-shadow-card overflow-hidden flex flex-col group"
    >
      {/* Top: Header + Image */}
      <div className="flex flex-col lg:flex-row border-b-4 border-[var(--color-accent-pencil)]">

        {/* Concept Header */}
        <div className="bg-[var(--color-surface-container)] p-8 lg:w-80 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-[var(--color-accent-pencil)] relative">
          <button
            onClick={() => setResults((prev: StrategistResponse | null) => prev ? { ...prev, thumbnails: prev.thumbnails.filter((t: ThumbnailConcept) => t.concept_number !== concept.concept_number) } : prev)}
            className="absolute top-4 right-4 p-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors neo-button"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-secondary-yellow)] neo-border flex items-center justify-center font-headline text-xl font-bold text-[var(--color-on-surface)] shrink-0">
                {concept.concept_number}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-headline font-bold text-[var(--color-primary)]">{getCTRScore(concept)}%</span>
                <span className="text-[9px] font-label uppercase opacity-40 leading-none">Est. CTR</span>
              </div>
            </div>
            <h4 className="text-2xl font-headline font-bold text-[var(--color-on-surface)] leading-tight">
              {concept.concept_name}
            </h4>
          </div>
          <button
            onClick={() => toggleLike(concept)}
            className={`mt-6 flex items-center gap-2 px-4 py-2 neo-border neo-shadow-button font-label text-xs uppercase transition-all ${isLiked ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-yellow)]'}`}
            title={isLiked ? "Remove from references" : "Save as reference for next generation"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            {isLiked ? 'Referenced' : 'Use as Reference'}
          </button>
        </div>

        {/* Image */}
        <div className="relative flex-1 aspect-video bg-[var(--color-surface-container)] group/image">
          <div className={`w-full h-full transition-all duration-500 ${mobilePreviewFor[concept.concept_number] ? 'scale-[0.15] origin-top-left translate-x-8 translate-y-8 shadow-2xl ring-8 ring-black' : 'scale-100'}`}>
            {concept.imageUrl ? (
              <img
                src={concept.imageUrl}
                alt={concept.concept_name}
                className="w-full h-full object-cover img-sketch-filter"
                referrerPolicy="no-referrer"
                style={{
                  filter: `brightness(${100 + (imageEdits[concept.concept_number]?.brightness || 0)}%) contrast(${100 + (imageEdits[concept.concept_number]?.contrast || 0)}%) saturate(${100 + (imageEdits[concept.concept_number]?.saturation || 0)}%)`
                }}
              />
            ) : isRefining ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[var(--color-surface-container)]">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-surface-variant)]" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--color-primary)] animate-spin" />
                </div>
                <p className="text-[9px] font-label uppercase tracking-[0.2em] opacity-30 animate-pulse">Generating image</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-8 text-center bg-[var(--color-surface-container)]">
                <div className="w-10 h-10 flex items-center justify-center bg-[var(--color-surface)] neo-border neo-shadow-button">
                  <AlertCircle className="w-5 h-5 text-[var(--color-on-surface)]/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-label uppercase tracking-widest opacity-50">Image generation failed</p>
                  <p className="text-[9px] font-body opacity-30">The image could not be created</p>
                </div>
                <button
                  onClick={() => handleRegenerateImage(concept)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white neo-button neo-shadow-button font-label text-xs uppercase hover:bg-[var(--color-primary-dim)] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}
          </div>

          {mobilePreviewFor[concept.concept_number] && (
            <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-8">
              <div className="bg-black/80 text-white px-4 py-2 font-label text-xs uppercase tracking-widest neo-border">
                Mobile Preview (120x90px)
              </div>
            </div>
          )}

          {/* Image overlay buttons (visible on hover) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
            <button
              onClick={() => setMobilePreviewFor(prev => ({ ...prev, [concept.concept_number]: !prev[concept.concept_number] }))}
              className={`p-3 neo-border neo-shadow-button transition-all ${mobilePreviewFor[concept.concept_number] ? 'bg-[var(--color-secondary-yellow)] text-black' : 'bg-white text-black hover:bg-[var(--color-secondary-blue)] hover:text-white'}`}
              title="Toggle Mobile Preview"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            {/* Re-roll image */}
            <button
              onClick={() => handleRegenerateImage(concept)}
              className="p-3 bg-white text-black neo-border neo-shadow-button hover:bg-[var(--color-secondary-yellow)] transition-all"
              title="Re-roll Image"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = concept.imageUrl || '';
                link.download = `thumbnail-concept-${concept.concept_number}.png`;
                link.click();
              }}
              disabled={!concept.imageUrl}
              className="p-3 bg-white text-black neo-border neo-shadow-button hover:bg-[var(--color-secondary-blue)] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Download Asset"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Refining overlay */}
          {isRefining && (
            <div className="absolute inset-0 bg-[var(--color-bg)]/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-3 bg-[var(--color-surface)] text-[var(--color-primary)] px-8 py-4 neo-border neo-shadow-button font-label text-lg uppercase">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Recompiling Assets...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Details + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-[var(--color-accent-pencil)]">

        {/* Concept Details */}
        <div className="p-8 bg-[var(--color-surface)] lg:border-r-4 border-[var(--color-accent-pencil)] space-y-6">
          {/* Primary: Hook + Psychology — largest visual weight */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-label uppercase opacity-50 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Hook
              </span>
              <p className="text-sm font-bold uppercase tracking-tight leading-tight pl-2 border-l-2 border-[var(--color-primary)]">{concept.hook}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-label uppercase opacity-50 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Psychology
              </span>
              <p className="text-sm font-bold uppercase tracking-tight leading-tight pl-2 border-l-2 border-[var(--color-secondary-blue)]">{concept.psychology}</p>
            </div>
          </div>

          {/* Primary: Text Overlay — standout callout */}
          <div className="space-y-2">
            <span className="text-[10px] font-label uppercase opacity-50 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Text Overlay
            </span>
            <div className="bg-[var(--color-surface-container)] p-4 neo-border">
              <p className="text-2xl font-headline font-bold uppercase text-[var(--color-secondary-blue)] tracking-tight leading-none">{concept.text_overlay}</p>
            </div>
          </div>

          {/* Secondary: Layout + Color — smaller, lighter */}
          <div className="grid grid-cols-1 gap-4 pt-2 border-t border-black/5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-label uppercase opacity-40 flex items-center gap-1.5">
                <LayoutTemplate className="w-3 h-3" /> Layout
              </span>
              <p className="text-xs font-body leading-relaxed opacity-70">{concept.layout}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-label uppercase opacity-40 flex items-center gap-1.5">
                <Palette className="w-3 h-3" /> Color Strategy
              </span>
              <p className="text-xs font-body leading-relaxed opacity-70">{concept.color_strategy}</p>
            </div>
          </div>

          {/* Tertiary: CTR note + AI prompt */}
          <div className="pt-2 border-t border-black/5 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-label uppercase opacity-40 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> CTR Note
              </span>
              <p className="text-xs font-body italic opacity-60 leading-relaxed">{concept.ctr_explanation}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-label uppercase opacity-40 flex items-center gap-1.5">
                  <Wand2 className="w-3 h-3" /> AI Prompt
                </span>
                <button
                  onClick={copyPrompt}
                  className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-label uppercase neo-border transition-all ${copied ? 'bg-[var(--color-secondary-yellow)] opacity-100' : 'opacity-30 hover:opacity-80 hover:bg-[var(--color-surface-container)]'}`}
                >
                  <Copy className="w-2.5 h-2.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] font-mono opacity-50 leading-relaxed bg-[var(--color-surface-container)] p-3 neo-border break-words">{concept.image_generation_prompt}</p>
            </div>
          </div>
        </div>

        {/* Visual Hierarchy Controls */}
        <div className="p-8 bg-[var(--color-surface)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[var(--color-accent-pencil)] opacity-10 pointer-events-none" />

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-secondary-yellow)] neo-border">
              <Target className="w-5 h-5" />
            </div>
            <h5 className="font-headline text-2xl font-bold uppercase tracking-tight">Visual Hierarchy</h5>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-label uppercase font-bold flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Subject Size
                </label>
                <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">{imageEdits[concept.concept_number]?.subjectSize || 5}/10</span>
              </div>
              <input
                type="range" min="1" max="10"
                value={imageEdits[concept.concept_number]?.subjectSize || 5}
                onChange={(e) => updateImageEdit(concept.concept_number, { subjectSize: parseInt(e.target.value) })}
                className="w-full h-4 bg-[var(--color-surface-container)] neo-border appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-label uppercase font-bold flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  Text Position
                </label>
                <div className="grid grid-cols-3 gap-1 neo-border p-1 bg-[var(--color-surface-container)]">
                  {['top', 'center', 'bottom'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateImageEdit(concept.concept_number, { textPosition: pos as 'top' | 'center' | 'bottom' })}
                      className={`py-2 text-[10px] font-label uppercase transition-all ${imageEdits[concept.concept_number]?.textPosition === pos || (!imageEdits[concept.concept_number]?.textPosition && pos === 'center') ? 'bg-black text-white' : 'hover:bg-white'}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-label uppercase font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Emphasis
                </label>
                <div className="grid grid-cols-3 gap-1 neo-border p-1 bg-[var(--color-surface-container)]">
                  {['subject', 'text', 'balanced'].map((emp) => (
                    <button
                      key={emp}
                      onClick={() => updateImageEdit(concept.concept_number, { emphasis: emp as 'subject' | 'text' | 'balanced' })}
                      className={`py-2 text-[10px] font-label uppercase transition-all ${imageEdits[concept.concept_number]?.emphasis === emp || (!imageEdits[concept.concept_number]?.emphasis && emp === 'balanced') ? 'bg-black text-white' : 'hover:bg-white'}`}
                    >
                      {emp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const edit = imageEdits[concept.concept_number];
                const feedback = `Adjust visual hierarchy: Subject Size ${edit?.subjectSize || 5}, Text Position ${edit?.textPosition || 'center'}, Emphasis ${edit?.emphasis || 'balanced'}`;
                handleRefine(concept, feedback);
              }}
              className="w-full mt-6 bg-[var(--color-secondary-blue)] text-[var(--color-on-primary)] py-5 font-label uppercase neo-button neo-shadow-button hover:bg-[var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Apply Hierarchy Refinement
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: AI Feedback */}
      <div className="p-8 bg-[var(--color-surface-container)] border-t-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--color-primary)] neo-border">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-headline text-lg font-bold uppercase tracking-tight">AI Feedback</span>
          </div>
          <button
            onClick={() => setShowRefinementFor(prev => ({ ...prev, [concept.concept_number]: !showRefinement }))}
            className={`px-4 py-2 neo-border neo-shadow-button font-label text-xs uppercase transition-all ${showRefinement ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-on-surface)] hover:bg-[var(--color-secondary-yellow)]'}`}
          >
            {showRefinement ? 'Close' : 'Open Feedback'}
          </button>
        </div>

        {showRefinement && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <p className="text-xs font-label uppercase opacity-60 mb-3">Quick Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInputs(prev => ({ ...prev, [concept.concept_number]: s }))}
                    className={`px-3 py-1.5 text-xs font-label uppercase neo-border transition-all hover:bg-[var(--color-secondary-yellow)] ${chatInput === s ? 'bg-[var(--color-secondary-yellow)]' : 'bg-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-end">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInputs(prev => ({ ...prev, [concept.concept_number]: e.target.value }))}
                placeholder="Describe what to change (or click a suggestion above)..."
                className="flex-1 p-3 bg-white neo-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none min-h-[60px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface)]/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim()) handleRefine(concept);
                  }
                }}
              />
              <button
                onClick={() => { if (chatInput.trim()) handleRefine(concept); }}
                disabled={!chatInput.trim() || isRefining}
                className="p-3 bg-[var(--color-primary)] text-white neo-border neo-shadow-button hover:bg-[var(--color-primary-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-label text-sm uppercase"
              >
                <Send className="w-4 h-4" />
                Refine
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
