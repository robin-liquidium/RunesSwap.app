import TabPageLayout from '@/components/layout/TabPageLayout';

interface SwapPageProps {
  searchParams: Promise<{
    rune?: string;
  }>;
}

/**
 * Swap route page.
 */
export default async function SwapPage({ searchParams }: SwapPageProps) {
  const { rune } = await searchParams;
  return <TabPageLayout activeTab="swap" preSelectedRune={rune ?? null} />;
}
