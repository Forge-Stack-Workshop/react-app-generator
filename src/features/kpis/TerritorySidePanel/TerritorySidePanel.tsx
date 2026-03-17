import styles from "./TerritorySidePanel.module.scss";
import { useTerritoriesProvidersQuery } from "../../../domain/territories/queries";

export default function TerritorySidePanel({ territoryId, onClose }) {
  const { data: providers } = useTerritoriesProvidersQuery();
  const p = providers?.[territoryId];

  const sections = [
    { key: "shuttles", label: "Shuttles" },
    { key: "dispatch", label: "Dispatch" },
    { key: "security", label: "Sécurité" }
  ];

  const getStateClass = (state) => {
    switch (state) {
      case "on":
        return styles.on;
      case "errors":
        return styles.errors;
      case "unstable":
        return styles.unstable;
      case "off":
      case "offline":
        return styles.off;
      default:
        return styles.unknown;
    }
  };

  return (
    <div className={styles.panel}>
      <button className={styles.close} onClick={onClose}>×</button>

      {!p ? (
        <div className={styles.empty}>Aucune donnée</div>
      ) : (
        <div className={styles.content}>
          {sections.map(({ key, label }) => {
            const list = p[key] ?? [];

            return (
              <section key={key} className={styles.section}>
                <h3 className={styles.sectionTitle}>{label}</h3>

                {list.length === 0 ? (
                  <p className={styles.emptySmall}>Aucun provider</p>
                ) : (
                  <ul className={styles.providersList}>
                    {list.map((prov, i) => (
                      <li key={i} className={styles.providerRow}>
                        <span className={`${styles.statusIcon} ${getStateClass(prov.state)}`} />
                        <span className={styles.providerName}>{prov.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
