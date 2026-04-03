import LeafletMap from "../../features/monitoring/map/LeafletMap";
import MapCardSkeleton from "../skeletons/MapCardSkeleton";
import styles from "./MapCard.module.scss";
import type { Territory } from "../../domain/territories/territory.types";
import { useTerritoriesQuery } from "../../domain/territories/queries";

export default function MapCard({
  selectedTerritory,
}: {
  selectedTerritory: Territory;
}) {
  const { isLoading } = useTerritoriesQuery();

  if (isLoading) {
    return (
      <div className={styles.card}>
        <MapCardSkeleton />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <LeafletMap selectedTerritory={selectedTerritory} />
    </div>
  );
}
