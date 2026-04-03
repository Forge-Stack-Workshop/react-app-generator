import { useMap } from "react-leaflet";
import { useLeafletTerritory } from "../../../../hooks/map/useLeafletTerritory";
import RefocusControl from "./RefocusControl";
import type { Territory } from "../../../../domain/territories/territory.types";

export default function MapControls({
  selectedTerritory,
}: {
  selectedTerritory: Territory;
}) {
  const map = useMap();
  const { refocus } = useLeafletTerritory(map, selectedTerritory);

  return <RefocusControl refocus={refocus} />;
}
