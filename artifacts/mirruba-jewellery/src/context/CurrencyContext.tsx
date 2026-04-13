import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useStore } from "@/context/StoreContext";

type CurrencyCode = "AED" | "USD";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (value: CurrencyCode) => void;
}

const STORAGE_KEY = "mirruba_currency";

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "AED",
  setCurrency: () => {},
});

function normalizeCurrency(value: string | null | undefined): CurrencyCode {
  return value === "USD" ? "USD" : "AED";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  const [currency, setCurrencyState] = useState<CurrencyCode>(() =>
    normalizeCurrency(typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : "AED")
  );

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) {
      setCurrencyState(normalizeCurrency(store.currency));
    }
  }, [store.currency]);

  const setCurrency = (value: CurrencyCode) => {
    const normalized = normalizeCurrency(value);
    setCurrencyState(normalized);
    window.localStorage.setItem(STORAGE_KEY, normalized);
  };

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
