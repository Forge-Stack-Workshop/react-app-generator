import { Marker, Popup } from "react-leaflet";
import { useTerritoriesQuery } from "../../../domain/territories/queries";

export default function MapMarkers() {
  const { data: territories } = useTerritoriesQuery();

  return (
    <>
      {territories
        ?.filter((t) => t.coords)
        .map((t) => (
          <Marker key={t.id} position={t.coords}>
            <Popup>{t.name}</Popup>
          </Marker>
        ))}
    </>
  );
}
