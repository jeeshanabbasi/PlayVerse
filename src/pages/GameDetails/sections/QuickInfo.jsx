import { memo } from 'react';
import { Gamepad2, Wifi, WifiOff } from 'lucide-react';
import { Section } from '@components/layout';
import { Chip, Tag } from '@ui';
import { MotionReveal } from '../shared';

export const QuickInfo = memo(function QuickInfo({ game }) {
  return (
    <Section title="Overview" description={game.description} spacing="md">
      <MotionReveal>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5 rounded-xl border border-border bg-surface/70 p-5 md:p-6">
            <div>
              <h3 className="text-heading-sm text-text mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-heading-sm text-text mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {game.features.map((feature) => (
                  <Tag key={feature} variant="primary">{feature}</Tag>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-heading-sm text-text mb-3">Languages</h3>
              <p className="text-body-md">{game.languages.join(' · ')}</p>
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <InfoTile
              icon={Gamepad2}
              label="Controller"
              value={game.controllerSupport ? 'Supported' : 'Keyboard / Mouse'}
              active={game.controllerSupport}
            />
            <InfoTile
              icon={Wifi}
              label="Online"
              value={game.online ? 'Multiplayer ready' : 'Unavailable'}
              active={game.online}
            />
            <InfoTile
              icon={WifiOff}
              label="Offline"
              value={game.offline ? 'Available' : 'Online required'}
              active={game.offline}
            />
          </div>
        </div>
      </MotionReveal>
    </Section>
  );
});

function InfoTile({ icon: Icon, label, value, active }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex items-start gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-label mb-1">{label}</p>
        <p className={active ? 'text-sm font-medium text-text' : 'text-sm text-text-secondary'}>
          {value}
        </p>
      </div>
    </div>
  );
}
