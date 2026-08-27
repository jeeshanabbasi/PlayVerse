import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Tv, Trash2, ShieldAlert, User, Palette, Gamepad, Sparkles, Download, HeartOff } from 'lucide-react';
import { cn, playUiTick, playUiClick, setMuteState, getMuteState } from '@utils/index';
import { useToast } from '@context/index';

const AVATARS = ['👾', '🚀', '🐱', '🦖', '👑', '⚡', '👽', '🦊', '🤖'];

function SettingsDrawerComponent({ isOpen, onClose }) {
  const { addToast } = useToast();
  
  const [nickname, setNickname] = useState(() => {
    try {
      const stored = localStorage.getItem('playverse_profile');
      if (stored) return JSON.parse(stored).nickname || 'Jeeshan Abbasi';
    } catch {}
    return 'Jeeshan Abbasi';
  });

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    try {
      const stored = localStorage.getItem('playverse_profile');
      if (stored) return JSON.parse(stored).avatar || '👾';
    } catch {}
    return '👾';
  });

  const [crtEnabled, setCrtEnabled] = useState(() => {
    return localStorage.getItem('playverse_global_crt') === 'true';
  });

  const [soundMuted, setSoundMuted] = useState(() => {
    return getMuteState();
  });

  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem('playverse_accent_theme') || 'purple';
  });

  const [mobileControls, setMobileControls] = useState(() => {
    const raw = localStorage.getItem('playverse_mobile_controls');
    return raw ? raw === 'true' : true;
  });

  const [screensaverEnabled, setScreensaverEnabled] = useState(() => {
    return localStorage.getItem('playverse_screensaver_enabled') !== 'false';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-accent-theme', accentTheme);
  }, [accentTheme]);

  const handleThemeChange = (theme) => {
    playUiClick();
    setAccentTheme(theme);
    localStorage.setItem('playverse_accent_theme', theme);
  };

  const handleToggleMobileControls = () => {
    playUiClick();
    const next = !mobileControls;
    setMobileControls(next);
    localStorage.setItem('playverse_mobile_controls', next ? 'true' : 'false');
    window.dispatchEvent(new Event('playverse_mobile_controls_updated'));
  };

  const handleToggleScreensaver = () => {
    playUiClick();
    const next = !screensaverEnabled;
    setScreensaverEnabled(next);
    localStorage.setItem('playverse_screensaver_enabled', next ? 'true' : 'false');
  };

  // Save profile edits in local storage and dispatch update event
  const saveProfile = (nextNick, nextAv) => {
    try {
      localStorage.setItem(
        'playverse_profile',
        JSON.stringify({ nickname: nextNick, avatar: nextAv })
      );
      window.dispatchEvent(new Event('playverse_profile_updated'));
    } catch {}
  };

  const handleNicknameChange = (e) => {
    const val = e.target.value;
    setNickname(val);
    saveProfile(val, selectedAvatar);
  };

  const handleAvatarSelect = (av) => {
    playUiClick();
    setSelectedAvatar(av);
    saveProfile(nickname, av);
  };

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

  const handleClearFavorites = () => {
    playUiClick();
    localStorage.removeItem('playverse_favorites');
    window.dispatchEvent(new Event('playverse_favorites_updated'));
    addToast({ title: 'Favorites cleared', description: 'Your game shelf is empty now.', variant: 'success' });
  };

  const handleExportData = () => {
    playUiClick();
    const data = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith('playverse')) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'playverse-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Progress exported', description: 'Your local PlayVerse data is ready.', variant: 'success' });
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
            className="w-full max-w-sm h-full bg-background border-l border-border px-6 py-8 flex flex-col justify-between shadow-2xl relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
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

              {/* Gamer Profile settings */}
              <div className="space-y-4 text-left">
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Profile Settings
                </p>

                {/* Nickname Input */}
                <div className="space-y-1.5">
                  <label htmlFor="gamer-nickname" className="text-xs font-semibold text-text-secondary">Gamer Nickname</label>
                  <input
                    id="gamer-nickname"
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder-text-muted focus:border-primary/45 focus:outline-none transition-colors"
                    placeholder="Enter gamer name..."
                  />
                </div>

                {/* Emojis Selector */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-secondary">Choose Avatar</p>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => handleAvatarSelect(av)}
                        onMouseEnter={playUiTick}
                        className={cn(
                          'flex items-center justify-center h-10 w-10 text-xl rounded-xl border transition-all duration-200',
                          selectedAvatar === av
                            ? 'bg-primary/10 border-primary text-text shadow-[var(--shadow-glow)]'
                            : 'bg-surface border-border hover:border-border-hover text-text-secondary'
                        )}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Customizer settings */}
              <div className="space-y-4 text-left pt-4 border-t border-border/40">
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Console Accent
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'purple', name: 'Default', colorClass: 'bg-[#7c3aed]' },
                    { id: 'green', name: 'Matrix', colorClass: 'bg-[#10b981]' },
                    { id: 'orange', name: 'Outrun', colorClass: 'bg-[#f97316]' },
                    { id: 'blue', name: 'Cobalt', colorClass: 'bg-[#2563eb]' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme.id)}
                      onMouseEnter={playUiTick}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[10px] font-semibold transition-all duration-200 cursor-pointer',
                        accentTheme === theme.id
                          ? 'border-primary bg-primary/10 text-text shadow-[var(--shadow-glow)]'
                          : 'bg-surface border-border text-text-secondary hover:border-border-hover'
                      )}
                    >
                      <span className={cn('h-3.5 w-3.5 rounded-full border border-white/20', theme.colorClass)} />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Settings items */}
              <div className="space-y-4 text-left pt-4 border-t border-border/40">
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Console Preferences</p>
                
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

                {/* Mobile Virtual Controller Mode */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-surface/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/25">
                      <Gamepad className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">Mobile D-Pad Overlay</p>
                      <p className="text-[11px] text-text-secondary">Touch screen controller.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mobileControls}
                      onChange={handleToggleMobileControls}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                {/* Screensaver Mode */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-surface/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/25">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">Arcade Screensaver</p>
                      <p className="text-[11px] text-text-secondary">Attract mode after 60s idle.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={screensaverEnabled}
                      onChange={handleToggleScreensaver}
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
            <div className="space-y-4 mt-8 pt-4 border-t border-border/40">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={handleExportData} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-hover hover:text-text">
                  <Download className="h-4 w-4" /> Export Progress
                </button>
                <button type="button" onClick={handleClearFavorites} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-hover hover:text-text">
                  <HeartOff className="h-4 w-4" /> Clear Favorites
                </button>
              </div>
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
export default SettingsDrawer;
