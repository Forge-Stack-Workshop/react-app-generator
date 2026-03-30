import { MapContainer, TileLayer } from "react-leaflet";
import styles from "./LeafletMap.module.scss";
import MapMarkers from "./MapMarkers";
import MapControls from "./controls/MapControls";

export default function LeafletMap({ selectedTerritory }) {
  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[46.5, 2.5]}
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
