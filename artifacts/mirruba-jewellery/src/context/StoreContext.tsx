import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface StoreInfo {
  storeName: string;
  tagline: string;
  currency: string;
  usdRate: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  developerName: string;
  developerUrl: string;
}

const defaults: StoreInfo = {
  storeName: "Mirruba Jewellery",
  tagline: "An Icon Of Absolute Femininity",
  currency: "AED",
  usdRate: "3.67",
  whatsappNumber: "971501045496",
  contactEmail: "contact@mirruba-jewellery.com",
  contactPhone: "+971 501 045 496",
  address: "Sharjah, Emirates, Central Market",
  facebookUrl: "",
  instagramUrl: "",
  developerName: "Mr Apps",
  developerUrl: "https://mr-appss.com/",
};

const StoreContext = createContext<StoreInfo>(defaults);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<StoreInfo>(defaults);

  useEffect(() => {
    fetch("/api/store-info")
      .then((r) => r.json())
      .then((data) => setInfo({ ...defaults, ...data }))
      .catch(() => {});
  }, []);

  return <StoreContext.Provider value={info}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
