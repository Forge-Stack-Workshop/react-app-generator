// @ts-nocheck – leaflet is a peer dependency of react-leaflet without @types/leaflet installed
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import styles from "../LeafletMap.module.scss";

export default function RefocusControl({ refocus }: { refocus: () => void }) {
  const map = useMap();

  useEffect(() => {
    const ctrl = L.control({ position: "topleft" });

    ctrl.onAdd = (): HTMLElement => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-control leaflet-bar",
      ) as HTMLElement;
      container.classList.add(styles.refocusControl);

      const link = L.DomUtil.create(
        "a",
        styles.refocusButton,
        container,
      ) as HTMLAnchorElement;
      link.href = "#";
      link.innerHTML = "◎";
      link.title = "Recentrer la carte";

      L.DomEvent.on(link, "click", (e: Event) => {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        refocus();
      });

      return container;
    };

    ctrl.addTo(map);
    return () => ctrl.remove();
  }, [refocus, map]);

  return null;
}
