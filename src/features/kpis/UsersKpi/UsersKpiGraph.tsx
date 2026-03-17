import styles from "./UsersKpiGraph.module.scss";

type Point = { hour: number; connected: number };

export default function UsersKpiGraph({ data = [] as Point[] }) {
  if (!data || data.length === 0) {
    return <div className={styles.graphSpace} />;
  }

  // Toujours 12 derniers points
  const cleaned = [...data]
    .filter((p, i, arr) => arr.findIndex(x => x.hour === p.hour) === i)
    .sort((a, b) => a.hour - b.hour)
    .slice(-12);

  const maxY = Math.max(...cleaned.map(p => p.connected), 0) || 1;
  const n = cleaned.length;

  // Cas 1 : un seul point → afficher un point
  if (n === 1) {
    const y = 100 - (cleaned[0].connected / maxY) * 100;
    return (
      <div className={styles.graphContainer}>
        <div className={styles.graphRow}>
          <div className={styles.axisY}>
            <span>{maxY}</span>
            <span>0</span>
          </div>

          <div className={styles.graphSpace}>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              width="100%"
              height="100%"
            >
              <circle cx="50" cy={y} r="2" fill="var(--primary)" />
            </svg>
          </div>
        </div>

        <div className={styles.axisXLabels}>
          <span>{cleaned[0].hour}h</span>
        </div>
      </div>
    );
  }

  // Cas 2 : plusieurs points → polyline propre
  const points = cleaned
    .map((p, i) => {
      const x = (i / (n - 1)) * 100;
      const y = 100 - (p.connected / maxY) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphRow}>
        <div className={styles.axisY}>
          <span>{maxY}</span>
          <span>0</span>
        </div>

        <div className={styles.graphSpace}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <polyline
              points={points}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className={styles.axisXLabels}>
        {cleaned.map((p) => (
          <span key={p.hour}>{p.hour}h</span>
        ))}
      </div>
    </div>
  );
}
