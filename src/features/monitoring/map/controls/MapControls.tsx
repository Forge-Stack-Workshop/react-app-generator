import { useMap } from "react-leaflet";
import { useLeafletTerritory } from "../../../../hooks/map/useLeafletTerritory";
import RefocusControl from "./RefocusControl";

export default function MapControls({ selectedTerritory }) {
  const map = useMap();
  const { refocus } = useLeafletTerritory(map, selectedTerritory);

  return <RefocusControl refocus={refocus} />;
}
