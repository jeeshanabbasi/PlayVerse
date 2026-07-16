import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="container-app flex flex-col items-center justify-center min-h-[60vh] py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-6 max-w-lg"
      >
        <p className="text-label text-primary">Error 404</p>

        <h1 className="text-display-lg">
          <span className="gradient-text">Lost in the</span>
          <br />
          <span className="text-text">PlayVerse</span>
        </h1>

        <p className="text-body-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-ghost"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go Back
          </button>
        </div>
      </motion.div>
    </section>
  );
}
