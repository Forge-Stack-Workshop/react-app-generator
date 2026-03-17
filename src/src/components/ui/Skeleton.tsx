import styles from "./Skeleton.module.scss";
/*
Component générique pour le placeholder loading il est loader par chaque "brique" à imiter évite la duplication de code
*/

export default function Skeleton({
  width = "100%",
  height = "16px",
  radius = "4px",
}) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius: radius }}
    />
  );
}
