import styles from "./GlobalLoader.module.scss";

export default function GlobalLoader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
