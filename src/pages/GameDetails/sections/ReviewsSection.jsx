import { memo } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { Avatar, Rating } from '@ui';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionReveal } from '../shared';

export const ReviewsSection = memo(function ReviewsSection({ game }) {
  return (
    <Section
      title="Community Reviews"
      description="What players are saying across PlayVerse."
      spacing="md"
    >
      <MotionReveal>
        <motion.ul
          className="grid gap-4 md:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {game.reviews.map((review) => (
            <motion.li
              key={review.id}
              variants={staggerItem}
              className="rounded-xl border border-border bg-surface p-5 space-y-4 hover:border-border-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar src={review.avatar} name={review.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text truncate">{review.name}</p>
                  <p className="text-body-sm">{review.date}</p>
                </div>
                <Rating value={review.rating} readOnly size="sm" />
              </div>
              <p className="text-body-md text-text-secondary">{review.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </MotionReveal>
    </Section>
  );
});
