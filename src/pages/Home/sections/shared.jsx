import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Compass,
  Puzzle,
  Joystick,
  Brain,
  Gauge,
  Trophy,
  Skull,
} from 'lucide-react';

export const CATEGORY_ICONS = {
  Zap,
  Compass,
  Puzzle,
  Joystick,
  Brain,
  Gauge,
  Trophy,
  Skull,
};

export const MotionSection = memo(function MotionSection({
  children,
  className,
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
});

export { useCountdown } from '@hooks/useCountdown';
