import { useTerritoriesQuery } from "../../domain/territories/queries";
import LeafletMap from "../../features/monitoring/map/LeafletMap";
import MapCardSkeleton from "../skeletons/MapCardSkeleton";
import styles from "./MapCard.module.scss";

export default function MapCard({ selectedTerritory }) {
  const { data: territories, isLoading } = useTerritoriesQuery();

  if (isLoading) {
    return (
      <div className={styles.card}>
        <MapCardSkeleton />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <LeafletMap
        territories={territories}
        selectedTerritory={selectedTerritory}
      />
    </div>
  );
}
