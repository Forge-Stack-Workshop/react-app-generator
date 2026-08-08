import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import styles from "./LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const { current, languages, change } = useLanguage();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const handleSelect = (lng: "fr" | "en") => {
    change(lng);
    setOpen(false);
  };

  return (
    <div className={styles.switcher} onClick={toggle}>
      <img
        src={languages[current].flag}
        alt={current}
        className={styles.icon}
      />
      {open && (
        <div className={styles.menu}>
          {Object.entries(languages)
            .filter(([lng]) => lng !== current)
            .map(([lng, data]) => (
              <img
                key={lng}
                src={data.flag}
                alt={data.label}
                className={styles.menuIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(lng as "fr" | "en");
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
