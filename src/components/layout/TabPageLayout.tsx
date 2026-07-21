import { Suspense } from 'react';

import styles from '@/app/page.module.css';
import { AppInterface } from '@/components/layout/AppInterface';
import type { ActiveTab } from '@/components/layout/TabNavigation';
import TabNavigation from '@/components/layout/TabNavigation';
import { Loading } from '@/components/loading/Loading';

interface TabPageLayoutProps {
  activeTab: ActiveTab;
  preSelectedRune?: string | null;
}

/**
 * Shared page layout for all tab routes.
 *
 * Renders top navigation and the tab-specific interface content.
 */
export default function TabPageLayout({ activeTab, preSelectedRune = null }: TabPageLayoutProps) {
  return (
    <div className={styles.mainContainer}>
      <TabNavigation />
      <Suspense fallback={<Loading variant="progress" message="Loading application..." />}>
        <AppInterface activeTab={activeTab} preSelectedRune={preSelectedRune} />
      </Suspense>
    </div>
  );
}
