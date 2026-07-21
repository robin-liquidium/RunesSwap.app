import TabPageLayout from '@/components/layout/TabPageLayout';

interface SwapPageProps {
  searchParams: Promise<{
    rune?: string | string[];
  }>;
}

/**
 * Swap route page.
 */
export default async function SwapPage({ searchParams }: SwapPageProps) {
  const { rune } = await searchParams;
  const selectedRune = Array.isArray(rune) ? (rune[0] ?? null) : (rune ?? null);
  return <TabPageLayout activeTab="swap" preSelectedRune={selectedRune} />;
}
