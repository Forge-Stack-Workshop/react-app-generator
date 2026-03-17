import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
