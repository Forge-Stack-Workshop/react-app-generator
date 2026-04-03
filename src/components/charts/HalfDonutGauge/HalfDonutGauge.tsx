import { PieChart } from "react-minimal-pie-chart";

type Props = {
  online: number | undefined;
  unstable: number | undefined;
  error: number | undefined;
  offline: number | undefined;
};

export default function HalfDonutGauge({
  online,
  unstable,
  error,
  offline,
}: Props) {
  // Sécurisation anti-NaN
  const safeOnline = Number(online) || 0;
  const safeUnstable = Number(unstable) || 0;
  const safeError = Number(error) || 0;
  const safeOffline = Number(offline) || 0;

  const total = safeOnline + safeUnstable + safeError + safeOffline;

  // react-minimal-pie-chart n'aime pas total=0 → on force 1
  const safeTotal = total > 0 ? total : 1;

  const data = [
    { title: "Online", value: safeOnline, color: "var(--status-online)" },
    { title: "Unstable", value: safeUnstable, color: "var(--status-unstable)" },
    { title: "Error", value: safeError, color: "var(--status-error)" },
    { title: "Offline", value: safeOffline, color: "var(--status-offline)" },
  ];

  return (
    <PieChart
      data={data}
      totalValue={safeTotal}
      lineWidth={22}
      startAngle={180}
      lengthAngle={180}
      animate
      style={{ height: "150px" }}
    />
  );
}
