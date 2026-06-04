import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useTranslation } from "react-i18next";
import styles from "./BackendConnectionBanner.module.scss";

/**
 * Sticky banner displayed at the top of every page when the backend is unreachable.
 * Non-dismissible — clears automatically when connectivity is restored.
 */
export function BackendConnectionBanner() {
  const isBackendDown = useBackendStatus();
  const { t } = useTranslation();

  if (!isBackendDown) return null;

  return (
    <div
      className={styles.banner}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className={styles.icon} aria-hidden="true">
        ⚠️
      </span>
      <span className={styles.message}>{t("errors.backendDisconnected")}</span>
    </div>
  );
}
