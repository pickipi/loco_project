'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./HostNavbar.module.css";

const HostNavbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <Link
            href="/host/spaces"
            className={`${styles.navItem} ${
              pathname === "/host/spaces" ? styles.active : ""
            }`}
          >
            공간 관리
          </Link>
          <Link
            href="/host/spaces/register"
            className={`${styles.navItem} ${
              pathname === "/host/spaces/register" ? styles.active : ""
            }`}
          >
            공간 등록
          </Link>
        </div>
        <div className={styles.navRight}>
          {isLoggedIn ? (
            <>
              <span className={styles.welcomeText}>
                {userName}님 환영합니다
              </span>
              <button onClick={logout} className={styles.logoutButton}>
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/host/login" className={styles.loginButton}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HostNavbar; 