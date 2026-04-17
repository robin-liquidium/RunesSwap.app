import { redirect } from 'next/navigation';

/**
 * Root route always redirects to the canonical swap route.
 */
export default function Home() {
  redirect('/swap');
}
