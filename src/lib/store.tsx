import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  products as seedProducts,
  initialInvoices,
  type Invoice,
  type InvoiceLine,
  type Product,
} from "./demo-data";

type Lang = "ar" | "en";

type StoreValue = {
  products: Product[];
  invoices: Invoice[];
  lang: Lang;
  setLang: (l: Lang) => void;
  addInvoice: (input: {
    customer: string;
    lines: InvoiceLine[];
    payment: Invoice["payment"];
    discount: number;
    shipping: number;
    paid: number;
  }) => Invoice;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [lang, setLang] = useState<Lang>("ar");

  const value = useMemo<StoreValue>(
    () => ({
      products,
      invoices,
      lang,
      setLang,
      addInvoice: ({ customer, lines, payment, discount, shipping, paid }) => {
        const weight = lines.reduce((s, l) => s + l.qty * l.unitWeight, 0);
        const gross = lines.reduce((s, l) => s + l.qty * l.unitWeight * l.price, 0);
        const total = gross - discount + shipping;
        const invoice: Invoice = {
          id: `INV-${2419 + invoices.length - initialInvoices.length}`,
          customer,
          date: new Date().toISOString().slice(0, 10),
          weight,
          total,
          payment,
          status: paid >= total ? "مدفوعة" : paid > 0 ? "جزئي" : "غير مدفوعة",
          lines,
        };
        setInvoices((prev) => [invoice, ...prev]);
        setProducts((prev) =>
          prev.map((p) => {
            const line = lines.find((l) => l.productId === p.id);
            return line ? { ...p, qty: Math.max(0, p.qty - line.qty) } : p;
          }),
        );
        return invoice;
      },
    }),
    [products, invoices, lang],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
