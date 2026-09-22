import { useEffect, useMemo, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "./Autocomplete.module.css";

export interface AutocompleteOption {
  value: number;
  label: string;
  searchText: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  selected: AutocompleteOption | null;
  onSelect: (option: AutocompleteOption | null) => void;
  placeholder?: string;
  emptyMessage?: string;
}

function Autocomplete({
  options,
  selected,
  onSelect,
  placeholder = "Digite para buscar...",
  emptyMessage = "Nenhum resultado encontrado",
}: AutocompleteProps) {
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [previousSelected, setPreviousSelected] = useState(selected);

  if (previousSelected !== selected) {
    setPreviousSelected(selected);
    setQuery(selected?.label ?? "");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        option.searchText.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectOption(option: AutocompleteOption) {
    onSelect(option);
    setQuery(option.label);
    setOpen(false);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setOpen(true);
    setHighlightedIndex(0);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[highlightedIndex];

      if (option) selectOption(option);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <Form.Control
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setOpen(true);
          setHighlightedIndex(0);
        }}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={open}
      />

      {open && (
        <ul className={styles.list} role="listbox">
          {filtered.length === 0 ? (
            <li className={styles.empty}>{emptyMessage}</li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={index === highlightedIndex}
                className={index === highlightedIndex ? styles.active : undefined}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;