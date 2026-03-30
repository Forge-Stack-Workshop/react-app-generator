import styles from "./GlobalLoader.module.scss";

export default function GlobalLoader() {
  console.log("GLOBAL LOADER RENDU");

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
