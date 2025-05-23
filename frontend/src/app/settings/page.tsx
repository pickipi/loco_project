'use client';

import HostHeader from '@/components/header/hostheader';
import NotificationToggle from './notifications/notification';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <HostHeader />
      <main className={styles.main}>
        <NotificationToggle />
      </main>
    </div>
  );
} 