/**
 * MiniDonut
 * ---------
 * Donut circulaire simple (0 → 1) utilisé pour afficher un ratio.
 *
 * Props :
 *   - value : nombre entre 0 et 1
 *   - className : permet d'appliquer une couleur via le parent
 *
 * Utilisation :
 *   <MiniDonut value={0.63} className={styles.availability} />
 */

import styles from "./MiniDonut.module.scss";

type MiniDonutProps = {
  value: number;
  className?: string; // pour wrapper <svg>
  valueClassName?: string; // pour la valeur (couleur)
};

export default function MiniDonut({
  value,
  className,
  valueClassName,
}: MiniDonutProps) {
  const size = 54;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value);

  return (
    <svg
      width={size}
      height={size}
      className={`${styles.donut} ${className ?? ""}`}
    >
      <circle
        className={styles.donutBg}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
      />
      <circle
        className={`${styles.donutValue} ${valueClassName ?? ""}`}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
