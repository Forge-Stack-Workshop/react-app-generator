/**
 * KpiCard
 * -------
 * Composant générique pour afficher une carte KPI.
 *
 * Props :
 *   - title : titre du KPI
 *   - icon : icône React (ex: <FaUser />)
 *   - value : contenu principal (ReactNode)
 *   - footer : contenu optionnel (graph, détails…)
 *   - isLoading : affiche un skeleton si true
 *
 * Structure :
 *   [Header]  → icône + titre
 *   [Content] → valeur principale
 *   [Footer]  → optionnel (graph, liste…)
 */

import KpiCardSkeleton from "../skeletons/KpiCardSkeleton";
import styles from "./KpiCard.module.scss";
import { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  icon: ReactNode;
  value?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
};

export default function KpiCard({
  title,
  icon,
  value,
  footer,
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className={styles.card}>
        <KpiCardSkeleton />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>

      {value && (
        <div className={styles.content}>
          <span className={styles.value}>{value}</span>
        </div>
      )}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
