'use client';

import Button from '@/components/ui/Button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global fallback error boundary.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 24 }}>
          <h1>Application Error</h1>
          <p>{error.message || 'An unexpected error occurred.'}</p>
          <Button onClick={reset}>Reload</Button>
        </main>
      </body>
    </html>
  );
}
