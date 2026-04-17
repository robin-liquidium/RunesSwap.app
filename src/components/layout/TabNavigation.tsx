'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/app/page.module.css';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';

const TAB_ROUTES = [
  { tab: 'swap', href: '/swap', label: 'Swap' },
  { tab: 'borrow', href: '/borrow', label: 'Borrow' },
  { tab: 'runesInfo', href: '/runes-info', label: 'Runes Info' },
  { tab: 'yourTxs', href: '/your-txs', label: 'Your TXs' },
  { tab: 'portfolio', href: '/portfolio', label: 'Portfolio' },
] as const;

/**
 * Union type representing the available tabs in the application.
 */
export type ActiveTab = (typeof TAB_ROUTES)[number]['tab'];

/**
 * Renders the top tab navigation as route links.
 *
 * Active styling is derived from the current pathname.
 */
export default function TabNavigation() {
  const pathname = usePathname();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.tabsInHeader}>
        {TAB_ROUTES.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.tab}
              href={route.href}
              className={`${styles.pageTabButton} ${isActive ? styles.pageTabActive : ''}`}
            >
              {route.label}
            </Link>
          );
        })}
      </div>
      <div className={styles.connectButtonContainer}>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
