'use client';

import { useEffect } from 'react';

import styles from '@/app/page.module.css';
import Button from '@/components/ui/Button';
import { logger } from '@/lib/logger';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary for App Router segments.
 */
export default function RouteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error(
      'Unhandled route error',
      { message: error.message, digest: error.digest, stack: error.stack },
      'APP',
    );
  }, [error]);

  return (
    <div className={styles.container}>
      <h1 className="heading">Something went wrong</h1>
      <p>Please try again. If the problem persists, reload the page.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
