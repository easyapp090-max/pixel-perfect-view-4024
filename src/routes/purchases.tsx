import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-layout";
import { StatusBadge } from "@/components/kpi-card";
import { egp, kg, purchases, suppliers } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "المشتريات | فهمي ستيل" },
      { name: "description", content: "فواتير الشراء من الموردين بالأوزان والإجماليات." },
      { property: "og:title", content: "المشتريات | فهمي ستيل" },
      { property: "og:description", content: "فواتير الشراء من موردي الحديد." },
    ],
  }),
  component: Purchases,
});

function Purchases() {
  const { products } = useStore();
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState(suppliers[0].name);
  const [productId, setProductId] = useState(products[0].id);
  const [qty, setQty] = useState(100);
  const [price, setPrice] = useState(47);

  const product = products.find((p) => p.id === productId)!;
  const weight = product.unitWeight * qty;
  const total = weight * price;

  const field =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

  return (
    <div className="space-y-5">
      <PageHeader
        title="المشتريات"
        subtitle="توريدات الحديد من الموردين"
        action={
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:brightness-105"
          >
            <Plus className="size-4" /> فاتورة شراء
          </button>
        }
      />

      {open && (
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h2 className="mb-4 text-base font-bold">فاتورة شراء جديدة</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">المورد</span>
              <select className={field} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                {suppliers.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">الصنف</span>
              <select className={field} value={productId} onChange={(e) => setProductId(e.target.value)}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.size} — {p.thickness}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                الكمية (قطعة)
              </span>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                سعر الشراء (ج.م / كجم)
              </span>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className={field}
              />
            </label>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">الوزن</div>
              <div className="num mt-1 text-lg font-bold">{kg(weight)} كجم</div>
            </div>
            <div className="rounded-lg bg-primary/15 p-3">
              <div className="text-xs font-semibold text-primary">الإجمالي</div>
              <div className="num mt-1 text-lg font-bold">{egp(total)} ج.م</div>
            </div>
          </div>
          <button
            onClick={() => {
              toast.success("تم حفظ فاتورة الشراء بنجاح");
              setOpen(false);
            }}
            className="mt-4 h-11 rounded-lg bg-steel px-6 text-sm font-bold text-steel-foreground transition hover:opacity-90"
          >
            حفظ فاتورة الشراء
          </button>
        </section>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["المورد", "الفاتورة", "التاريخ", "الوزن", "الإجمالي", "الحالة"].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchases.map((p) => (
                <tr key={p.id} className="transition hover:bg-muted/50">
                  <td className="px-4 py-3 font-semibold">{p.supplier}</td>
                  <td className="num px-4 py-3">{p.id}</td>
                  <td className="num px-4 py-3 text-muted-foreground">{p.date}</td>
                  <td className="num px-4 py-3">{kg(p.weight)} كجم</td>
                  <td className="num px-4 py-3 font-semibold">{egp(p.total)} ج.م</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
