import { memo, useState, useCallback } from 'react';
import { Container } from '@components/layout';
import { Button, Input } from '@ui';
import { Mail } from 'lucide-react';
import { newsletterData } from '@data/index';
import { useToast } from '@hooks/index';
import { MotionSection } from './shared';

export const NewsletterSection = memo(function NewsletterSection() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!email.trim() || !email.includes('@')) {
        error('Invalid email', 'Enter a valid email to join the list.');
        return;
      }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      setLoading(false);
      setEmail('');
      success('You\'re in', 'Welcome to the PlayVerse drop list.');
    },
    [email, error, success],
  );

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-accent/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(34,211,238,0.2), transparent 35%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <MotionSection>
          <div className="mx-auto max-w-2xl text-center space-y-6 rounded-xl border border-border bg-surface/70 p-8 md:p-12 backdrop-blur-xl shadow-[var(--shadow-blur)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <h2 className="text-display-md text-text">{newsletterData.title}</h2>
              <p className="text-body-lg">{newsletterData.subtitle}</p>
            </div>

            <form
              onSubmit={submit}
              className="flex flex-col gap-3 sm:flex-row sm:items-start pt-2"
            >
              <div className="flex-1 w-full text-left">
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={newsletterData.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                magnetic
                className="w-full sm:w-auto shrink-0"
              >
                {newsletterData.cta}
              </Button>
            </form>
          </div>
        </MotionSection>
      </Container>
    </section>
  );
});
