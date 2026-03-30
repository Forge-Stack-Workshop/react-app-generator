/**
 * HorizontalBar
 * -------------
 * Barre horizontale normalisée sur un max commun.
 * Utilisée pour représenter des valeurs relatives (unstable, error, offline).
 *
 * Props :
 *   - label : texte affiché à gauche
 *   - value : valeur numérique brute
 *   - max : valeur maximale pour normaliser la largeur
 *   - className : couleur appliquée à la barre
 */

import styles from "./HorizontalBar.module.scss";

type HorizontalBarProps = {
  label: string;
  value: number;
  max: number;
  className?: string;
};

export default function HorizontalBar({
  label,
  value,
  max,
  className,
}: HorizontalBarProps) {
  const width = max === 0 ? 0 : (value / max) * 100;

  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>

      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${className ?? ""}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <span className={styles.barValue}>{value}</span>
    </div>
  );
}
