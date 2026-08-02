import React from 'react';
import { motion } from 'motion/react';
import { X, RefreshCw } from 'lucide-react';

export interface SettingsDrawerProps {
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

export const SettingsDrawer = ({
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
