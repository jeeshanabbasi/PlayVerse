import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Tv, Trash2, ShieldAlert } from 'lucide-react';
import { cn, playUiTick, playUiClick, setMuteState, getMuteState } from '@utils/index';
import { useToast } from '@context/index';

function SettingsDrawerComponent({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [crtEnabled, setCrtEnabled] = useState(() => {
    return localStorage.getItem('playverse_global_crt') === 'true';
  });
  const [soundMuted, setSoundMuted] = useState(() => {
    return getMuteState();
  });

  const handleToggleCrt = () => {
    playUiClick();
    const next = !crtEnabled;
    setCrtEnabled(next);
    localStorage.setItem('playverse_global_crt', next ? 'true' : 'false');
    addToast({
      title: next ? 'CRT Filter Enabled Globally' : 'CRT Filter Disabled Globally',
      description: 'Restart any active game session to apply changes.',
      variant: 'success',
    });
  };

  const handleToggleSound = () => {
    const next = !soundMuted;
    setMuteState(next);
    setSoundMuted(next);
    if (!next) {
      setTimeout(() => playUiClick(), 100);
    }
  };

  const handleClearData = () => {
    playUiClick();
    if (window.confirm('Are you sure you want to reset all game high scores, history, and achievements? This action is permanent.')) {
      // Loop through localStorage keys and delete those matching playverse prefix
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('playverse.') || key.startsWith('playverse_'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        addToast({
          title: 'Profile Reset Successfully',
          description: 'All high scores, badges, and history have been cleared.',
          variant: 'success',
        });
        setTimeout(() => window.location.reload(), 1200);
      } catch (e) {
        addToast({
          title: 'Reset Failed',
          description: 'Could not write to local storage.',
          variant: 'danger',
        });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[650] flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Drawer body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-full max-w-sm h-full bg-background border-l border-border px-6 py-8 flex flex-col justify-between shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="space-y-1 text-left">
                  <h3 className="text-lg font-bold text-text">Preferences</h3>
                  <p className="text-xs text-text-secondary">Customize your arcade experience.</p>
                </div>
                <button
                  onClick={() => {
                    playUiClick();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl hover:bg-border/30 text-text-secondary hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings items */}
              <div className="space-y-6 text-left">
                {/* CRT Mode */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-surface/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/25">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">CRT Screen Scanlines</p>
                      <p className="text-[11px] text-text-secondary">Retro display mode.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={crtEnabled}
                      onChange={handleToggleCrt}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                {/* Sounds Mode */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-surface/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/25">
                      {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">Sound Effects</p>
                      <p className="text-[11px] text-text-secondary">Menu and dashboard blips.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!soundMuted}
                      onChange={handleToggleSound}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </div>

            {/* Reset data block */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 rounded-xl bg-error/5 border border-error/20 text-left">
                <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-error">Danger Zone</p>
                  <p className="text-[10px] text-text-muted mt-1">Clearing console profile wipes high scores, history, and achievements.</p>
                </div>
              </div>
              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-center gap-2 py-3 border border-error/30 hover:border-error/50 bg-error/10 hover:bg-error/15 text-error text-sm font-semibold rounded-xl transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Profile Data</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SettingsDrawer = memo(SettingsDrawerComponent);
