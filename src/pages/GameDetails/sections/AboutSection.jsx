import { memo, useMemo } from 'react';
import { Section } from '@components/layout';
import { MotionReveal } from '../shared';
import { resolvePlayableDefinition } from '@games';
import { Info, Keyboard } from 'lucide-react';

export const AboutSection = memo(function AboutSection({ game }) {
  const definition = useMemo(() => resolvePlayableDefinition(game.slug), [game.slug]);
  const paragraphs = game.longDescription.split('\n\n').filter(Boolean);

  const instructions = definition?.instructions ?? [];
  const controls = definition?.controls ?? [];

  return (
    <Section title="How to Play" spacing="lg" className="bg-surface/25 border border-border/40 rounded-2xl p-6 md:p-8">
      <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Game Lore / Info */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <Info className="h-4.5 w-4.5 text-primary" />
            <span>Gameplay Guide</span>
          </h3>
          <div className="space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-body-md text-text-secondary leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {instructions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-text uppercase tracking-wider text-text-muted">Instructions</h4>
              <ul className="space-y-2.5">
                {instructions.map((step, idx) => (
                  <li key={step} className="flex gap-3 text-body-md text-text-secondary">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Controls Table */}
        <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-border/60 lg:pl-8">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <Keyboard className="h-4.5 w-4.5 text-primary" />
            <span>Control Layout</span>
          </h3>

          {controls.length > 0 ? (
            <div className="space-y-3">
              <p className="text-body-sm text-text-secondary">
                Standard controls configured for mobile, keyboard, and pointer.
              </p>
              <div className="space-y-2.5">
                {controls.map((item) => (
                  <div
                    key={`${item.action}-${item.keys}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border/80"
                  >
                    <span className="text-sm text-text-secondary font-medium">{item.action}</span>
                    <kbd className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono font-semibold text-text shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-body-md text-text-secondary">
              Touch swipe and keyboard inputs are auto-detected when game starts.
            </p>
          )}
        </div>
      </MotionReveal>
    </Section>
  );
});
