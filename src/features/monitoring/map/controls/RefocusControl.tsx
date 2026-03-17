import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import styles from "../LeafletMap.module.scss";

export default function RefocusControl({ refocus }) {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: "topleft" });

    control.onAdd = () => {
      const container = L.DomUtil.create("div", "leaflet-control leaflet-bar");
      container.classList.add(styles.refocusControl);

      const link = L.DomUtil.create("a", styles.refocusButton, container);
      link.href = "#";
      link.innerHTML = "◎";
      link.title = "Recentrer la carte";

      L.DomEvent.on(link, "click", (e) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        refocus();
      });

      return container;
    };

    control.addTo(map);
    return () => control.remove();
  }, [refocus, map]);

  return null;
}
