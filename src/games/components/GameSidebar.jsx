import { memo } from 'react';
import { Trophy, Keyboard, Info, Medal } from 'lucide-react';
import { ProgressBar } from '@ui';
import { cn } from '@utils/index';

export const GameSidebar = memo(function GameSidebar({
  instructions = [],
  controls = [],
  highScoreLabel = '0',
  bestScoreLabel,
  playCount = 0,
  lastPlayedLabel = 'Never',
  achievements = [],
  achievementPercent = 0,
  className,
}) {
  const best = bestScoreLabel ?? highScoreLabel;

  return (
    <aside
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-xl',
        'max-h-[70vh] lg:max-h-none overflow-y-auto',
        className,
      )}
      aria-label="Game information"
    >
      <Panel title="Scoreboard" icon={Trophy}>
        <Stat label="High Score" value={highScoreLabel} />
        <Stat label="Best Score" value={best} />
        <Stat label="Play Count" value={String(playCount)} />
        <Stat label="Last Played" value={lastPlayedLabel} />
      </Panel>

      <Panel title="Instructions" icon={Info}>
        {instructions.length ? (
          <ul className="space-y-2">
            {instructions.map((item) => (
              <li key={item} className="text-body-sm text-text-secondary">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm">No instructions provided.</p>
        )}
      </Panel>

      <Panel title="Controls" icon={Keyboard}>
        {controls.length ? (
          <ul className="space-y-2">
            {controls.map((item) => (
              <li
                key={`${item.action}-${item.keys}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-text-secondary">{item.action}</span>
                <kbd className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-text">
                  {item.keys}
                </kbd>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm">Keyboard and touch supported.</p>
        )}
      </Panel>

      <Panel title="Achievements" icon={Medal}>
        <ProgressBar
          value={achievementPercent}
          variant="accent"
          label="Completion"
          showValue
        />
        <ul className="mt-3 space-y-2">
          {achievements.length === 0 && (
            <li className="text-body-sm">Achievements unlock when a game module is registered.</li>
          )}
          {achievements.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-start gap-2.5 rounded-lg border px-3 py-2 transition-colors',
                item.unlocked
                  ? 'border-primary/30 bg-primary/10'
                  : 'border-border bg-background/40 opacity-70',
              )}
            >
              <span
                className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-surface border border-border text-sm"
                aria-hidden="true"
              >
                {item.icon ?? '🏆'}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text">{item.name ?? item.id}</p>
                {item.description && (
                  <p className="text-[11px] text-text-secondary mt-0.5">{item.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </aside>
  );
});

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden="true" />}
        <h2 className="text-heading-sm text-text">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-body-sm">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-text">{value}</span>
    </div>
  );
}
