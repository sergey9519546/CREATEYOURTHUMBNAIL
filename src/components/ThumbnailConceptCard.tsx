import React from 'react';
import { motion } from 'motion/react';
import { X, Smartphone, Download, Loader2, Zap, Activity, LayoutTemplate, MessageSquare, Palette, TrendingUp, Target, Box, RefreshCw, Send } from 'lucide-react';

interface ThumbnailConceptCardProps {
  concept: any;
  idx: number;
  mobilePreviewFor: Record<number, boolean>;
  setMobilePreviewFor: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  imageEdits: Record<number, any>;
  setImageEdits: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  refiningConcepts: Record<number, boolean>;
  getCTRScore: (concept: any) => number;
  handleRefine: (concept: any, feedback?: string) => void;
  setResults: React.Dispatch<React.SetStateAction<any>>;
  chatInputs: Record<number, string>;
  setChatInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

export const ThumbnailConceptCard: React.FC<ThumbnailConceptCardProps> = ({
  concept, idx, mobilePreviewFor, setMobilePreviewFor, imageEdits, setImageEdits, refiningConcepts, getCTRScore, handleRefine, setResults, chatInputs, setChatInputs
}) => {
  const updateImageEdit = (conceptNumber: number, updates: Partial<any>) => {
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.15 }}
      className="bg-[var(--color-surface)] neo-card neo-shadow-card overflow-hidden flex flex-col group"
    >
      {/* Top Section: Header + Image */}
      <div className="flex flex-col lg:flex-row border-b-4 border-[var(--color-accent-pencil)]">
        {/* Concept Header */}
        <div className="bg-[var(--color-surface-container)] p-8 lg:w-80 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-[var(--color-accent-pencil)] relative">
          <button 
            onClick={() => setResults(prev => prev ? { ...prev, thumbnails: prev.thumbnails.filter((t: any) => t.concept_number !== concept.concept_number) } : prev)}
            className="absolute top-4 right-4 p-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors neo-button"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-[var(--color-secondary-yellow)] neo-border flex items-center justify-center font-headline text-2xl font-bold text-[var(--color-on-surface)]">
              {concept.concept_number}
            </div>
            <h4 className="text-3xl font-headline font-bold text-[var(--color-on-surface)]">
              {concept.concept_name}
            </h4>
          </div>
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
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
              </div>
            )}
          </div>

          {/* Mobile Preview Overlay */}
          {mobilePreviewFor[concept.concept_number] && (
            <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-8">
              <div className="bg-black/80 text-white px-4 py-2 font-label text-xs uppercase tracking-widest neo-border">
                Mobile Preview (120x90px)
              </div>
            </div>
          )}

          {/* Image Actions Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
            <button 
              onClick={() => setMobilePreviewFor(prev => ({ ...prev, [concept.concept_number]: !prev[concept.concept_number] }))}
              className={`p-3 neo-border neo-shadow-button transition-all ${mobilePreviewFor[concept.concept_number] ? 'bg-[var(--color-secondary-yellow)] text-black' : 'bg-white text-black hover:bg-[var(--color-secondary-blue)] hover:text-white'}`}
              title="Toggle Mobile Preview"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = concept.imageUrl || '';
                link.download = `thumbnail-concept-${concept.concept_number}.png`;
                link.click();
              }}
              className="p-3 bg-white text-black neo-border neo-shadow-button hover:bg-[var(--color-secondary-blue)] hover:text-white transition-all"
              title="Download Asset"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* CTR Score Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-[var(--color-primary)] text-white px-4 py-2 neo-border neo-shadow-button flex flex-col items-center">
              <span className="text-[10px] font-label uppercase opacity-80 leading-none">Est. CTR</span>
              <span className="text-2xl font-headline font-bold leading-none">{getCTRScore(concept)}%</span>
            </div>
          </div>
          
          {/* Refinement Loading Overlay */}
          {refiningConcepts[concept.concept_number] && (
            <div className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-3 bg-[var(--color-surface)] text-[var(--color-primary)] px-8 py-4 neo-border neo-shadow-button font-label text-lg uppercase">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Recompiling Assets...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: Details + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-[var(--color-accent-pencil)]">
        {/* Concept Details */}
        <div className="p-8 bg-[var(--color-surface)] lg:border-r-4 border-[var(--color-accent-pencil)] space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Hook Strategy
              </span>
              <p className="text-sm font-bold uppercase tracking-tight leading-tight">{concept.hook}</p>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Psychology Trigger
              </span>
              <p className="text-sm font-bold uppercase tracking-tight leading-tight">{concept.psychology}</p>
            </div>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Layout & Composition
            </span>
            <p className="text-sm font-body leading-relaxed">{concept.layout}</p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Text Overlay
            </span>
            <div className="bg-[var(--color-surface-container)] p-4 neo-border">
              <p className="text-2xl font-headline font-bold uppercase text-[var(--color-secondary-blue)] tracking-tight leading-none">{concept.text_overlay}</p>
            </div>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Strategy
            </span>
            <p className="text-sm font-body leading-relaxed">{concept.color_strategy}</p>
          </div>
          <div className="pt-8 border-t-2 border-[var(--color-accent-pencil)]/10">
            <span className="text-xs font-label uppercase opacity-60 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              CTR Explanation
            </span>
            <p className="text-sm font-body italic opacity-80 mt-3 leading-relaxed">{concept.ctr_explanation}</p>
          </div>
        </div>

        {/* Visual Hierarchy Controls */}
        <div className="p-8 bg-[var(--color-surface)] space-y-8 relative overflow-hidden">
          {/* Decorative Blueprint Lines */}
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
                      onClick={() => updateImageEdit(concept.concept_number, { textPosition: pos as any })}
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
                      onClick={() => updateImageEdit(concept.concept_number, { emphasis: emp as any })}
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

          {/* Custom Refinement Chat */}
          <div className="pt-8 border-t-2 border-[var(--color-accent-pencil)]/10 mt-8 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[var(--color-primary)] neo-border text-white">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h5 className="font-headline text-lg font-bold uppercase tracking-tight">Custom Refinement</h5>
            </div>

            <div className="flex items-stretch gap-2">
              <textarea
                value={chatInputs[concept.concept_number] || ''}
                onChange={(e) => setChatInputs(prev => ({ ...prev, [concept.concept_number]: e.target.value }))}
                placeholder="e.g. 'Make the background more fiery' or 'Change the text to something scarier'"
                className="w-full p-3 font-body text-sm resize-none bg-[var(--color-surface-container)] neo-border focus:outline-none focus:bg-white transition-colors"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRefine(concept, chatInputs[concept.concept_number]);
                  }
                }}
              />
              <button
                onClick={() => handleRefine(concept, chatInputs[concept.concept_number])}
                disabled={!chatInputs[concept.concept_number]?.trim() || refiningConcepts[concept.concept_number]}
                className="bg-black text-white px-4 flex items-center justify-center neo-border hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
