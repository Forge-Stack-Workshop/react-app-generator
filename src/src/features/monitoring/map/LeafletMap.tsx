import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import styles from "./LeafletMap.module.scss";
import MapMarkers from "./MapMarkers";
import MapControls from "./controls/MapControls";
import type { Territory } from "../../../domain/territories/territory.types";

export default function LeafletMap({
  selectedTerritory,
}: {
  selectedTerritory: Territory;
}) {
  const center: LatLngTuple = [46.5, 2.5];
  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={center}
        zoom={6}
        minZoom={3}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        <MapControls selectedTerritory={selectedTerritory} />
        <MapMarkers />
      </MapContainer>
    </div>
  );
}
