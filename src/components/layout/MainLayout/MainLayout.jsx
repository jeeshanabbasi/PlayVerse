import { useState, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@components/layout/Header';
import { Footer } from '@components/layout/Footer';
import { SettingsDrawer } from '@components/layout/Header/SettingsDrawer';
import { QuickPlayProvider, useToast } from '@context/index';
import { CommandPalette, SurpriseMeModal, ArcadeScreensaver, TrophyCelebrationModal } from '@components/common';
import { useKonamiCode } from '@hooks/index';

export function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surpriseMeOpen, setSurpriseMeOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const storedTheme = localStorage.getItem('playverse_accent_theme') || 'purple';
    document.documentElement.setAttribute('data-accent-theme', storedTheme);

    const handleOpenSurpriseMe = () => setSurpriseMeOpen(true);
    window.addEventListener('playverse_open_surprise_me', handleOpenSurpriseMe);
    return () => window.removeEventListener('playverse_open_surprise_me', handleOpenSurpriseMe);
  }, []);

  useKonamiCode(() => {
    const isUnlocked = localStorage.getItem('playverse_konami_unlocked') === 'true';
    if (!isUnlocked) {
      localStorage.setItem('playverse_konami_unlocked', 'true');
      window.dispatchEvent(new Event('playverse_achievements_updated'));
      window.dispatchEvent(
        new CustomEvent('playverse_achievement_celebration', {
          detail: {
            title: 'Classic Codebreaker',
            description: 'You entered the legendary retro Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A!',
            icon: '👑',
            xp: 1000,
            isRecord: true,
          },
        })
      );
    } else {
      addToast({
        title: '👽 Code Active!',
        description: 'You have already unlocked this secret badge.',
        variant: 'info',
      });
    }
  });

  return (
    <QuickPlayProvider>
      <div className="flex flex-col min-h-dvh overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only-focusable fixed top-4 left-4 z-[600] px-4 py-2 bg-primary text-white rounded-xl"
        >
          Skip to content
        </a>

        <Header onSettingsClick={() => setSettingsOpen(true)} />

        <main id="main-content" className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="flex-1 flex flex-col min-w-0"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <CommandPalette />
        
        <SettingsDrawer
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />

        <SurpriseMeModal
          isOpen={surpriseMeOpen}
          onClose={() => setSurpriseMeOpen(false)}
        />

        <ArcadeScreensaver />
        <TrophyCelebrationModal />
      </div>
    </QuickPlayProvider>
  );
}
