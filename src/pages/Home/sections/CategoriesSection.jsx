import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@components/layout';
import { categories } from '@data/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { CATEGORY_ICONS, MotionSection } from './shared';

export const CategoriesSection = memo(function CategoriesSection() {
  return (
    <Section
      title="Categories"
      description="Find your next obsession by vibe."
      spacing="lg"
      className="bg-surface/30"
    >
      <MotionSection>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS.Zap;
            return (
              <motion.div key={category.id} variants={staggerItem}>
                <Link
                  to={`/games?genre=${category.id}`}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface p-4 md:p-5 transition-all duration-300 hover:border-border-hover hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div
                    className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: category.accent }}
                    aria-hidden="true"
                  />
                  <div
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border"
                    style={{
                      backgroundColor: `${category.accent}18`,
                      color: category.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="relative space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-heading-sm text-text">{category.label}</h3>
                      <ArrowUpRight className="h-4 w-4 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </div>
                    <p className="text-body-sm">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </MotionSection>
    </Section>
  );
});
