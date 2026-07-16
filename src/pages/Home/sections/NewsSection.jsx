import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section } from '@components/layout';
import { Badge } from '@ui';
import { gamingNews } from '@data/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection } from './shared';

export const NewsSection = memo(function NewsSection() {
  const [hero, ...rest] = gamingNews;

  return (
    <Section
      title="Gaming News"
      description="Updates, patch notes, and stories from the arena."
      spacing="md"
      action={
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      }
    >
      <MotionSection>
        <motion.div
          className="grid gap-4 lg:grid-cols-12 lg:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.article
            variants={staggerItem}
            className="group lg:col-span-7 overflow-hidden rounded-xl border border-border bg-surface hover:border-border-hover transition-colors"
          >
            <Link to={`/news/${hero.id}`} className="block focus-visible:outline-none">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 space-y-3">
                  <Badge variant="primary">{hero.category}</Badge>
                  <h3 className="text-heading-lg text-text max-w-xl">{hero.title}</h3>
                  <p className="text-body-md max-w-lg">{hero.excerpt}</p>
                  <p className="text-body-sm">
                    {hero.date} · {hero.readTime} read
                  </p>
                </div>
              </div>
            </Link>
          </motion.article>

          <div className="lg:col-span-5 flex flex-col gap-4">
            {rest.map((article) => (
              <motion.article
                key={article.id}
                variants={staggerItem}
                className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-surface p-3 hover:border-border-hover transition-colors"
              >
                <Link
                  to={`/news/${article.id}`}
                  className="flex w-full gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
                >
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-36">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
                    <Badge variant="muted" size="sm">{article.category}</Badge>
                    <h3 className="text-heading-sm text-text line-clamp-2">{article.title}</h3>
                    <p className="text-body-sm">
                      {article.date} · {article.readTime}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
