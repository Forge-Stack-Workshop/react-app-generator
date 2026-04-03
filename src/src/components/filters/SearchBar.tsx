import { useState, useMemo, useRef, useEffect } from "react";
import { useTerritoriesQuery } from "../../domain/territories/queries";
import { useTranslation } from "react-i18next";
import SearchBarSkeleton from "../skeletons/SearchBarSkeleton";
import styles from "./SearchBar.module.scss";
import type { Territory } from "../../domain/territories/territory.types";

function SearchBarContent({
  items,
  onSelect,
  placeholder,
}: {
  items: Territory[];
  onSelect: (territory: Territory) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [items, query]);

  const handleFocus = () => {
    setOpen(true);
    setQuery("");
  };

  const handleSelect = (t: Territory) => {
    onSelect(t);
    setQuery(t.name);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
      />

      {open && (
        <div className={styles.dropdown}>
          {filtered.length === 0 && (
            <div className={styles.empty}>Aucun résultat</div>
          )}

          {filtered.map((t) => (
            <div
              key={t.id}
              className={styles.item}
              onClick={() => handleSelect(t)}
            >
              {t.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  onSelect,
  placeholder,
}: {
  onSelect: (territory: Territory) => void;
  placeholder: string;
}) {
  const { data, isLoading } = useTerritoriesQuery();
  const { t } = useTranslation("common");

  if (isLoading || !data) {
    return (
      <div className={styles.wrapper}>
        <SearchBarSkeleton />
      </div>
    );
  }

  // 🔥 Reconstruction dynamique de "ALL" avec traduction
  const avgLat = data.reduce((sum, t) => sum + t.lat, 0) / data.length;
  const avgLng = data.reduce((sum, t) => sum + t.lng, 0) / data.length;

  const all = {
    id: "ALL",
    name: t("searchbar_all_territories"),
    lat: avgLat,
    lng: avgLng,
  };

  const items = [all, ...data];

  return (
    <SearchBarContent
      items={items}
      onSelect={onSelect}
      placeholder={placeholder}
    />
  );
}
