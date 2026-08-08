import { Outlet } from "react-router-dom";
import styles from "./BaseLayout.module.scss";

// Minimal feature-agnostic shell. Features may replace or wrap this via their
// own layout providers; the base only guarantees an <Outlet /> mount point.
export default function BaseLayout() {
  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
