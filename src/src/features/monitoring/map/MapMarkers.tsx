import { Marker, Popup } from "react-leaflet";
import { useTerritoriesQuery } from "../../../domain/territories/queries";

export default function MapMarkers() {
  const { data: territories } = useTerritoriesQuery();

  return (
    <>
      {territories
        ?.filter((t) => t.lat != null && t.lng != null)
        .map((t) => (
          <Marker key={t.id} position={[t.lat, t.lng]}>
            <Popup>{t.name}</Popup>
          </Marker>
        ))}
    </>
  );
}
