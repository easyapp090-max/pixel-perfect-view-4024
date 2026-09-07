import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { StatusBadge } from "@/components/kpi-card";
import { useStore } from "@/lib/store";
import { egp, kg, type Product } from "@/lib/demo-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "المخزون | فهمي ستيل" },
      { name: "description", content: "أصناف الحديد بالمقاسات والسماكات والأوزان والكميات المتاحة." },
      { property: "og:title", content: "المخزون | فهمي ستيل" },
      { property: "og:description", content: "أصناف الحديد بالمقاسات والأوزان والكميات." },
    ],
  }),
  component: Inventory,
});

const statusOf = (p: Product) =>
  p.qty === 0 ? "نافذ" : p.qty <= p.minQty ? "منخفض" : "متوفر";

function Inventory() {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [thick, setThick] = useState("all");
  const [state, setState] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const categories = [...new Set(products.map((p) => p.category))];
  const thicknesses = [...new Set(products.map((p) => p.thickness))];

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (`${p.name} ${p.size} ${p.thickness}`.includes(q.trim()) || q.trim() === "") &&
          (cat === "all" || p.category === cat) &&
          (thick === "all" || p.thickness === thick) &&
          (state === "all" || statusOf(p) === state),
      ),
    [products, q, cat, thick, state],
  );

  const select =
    "h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-ring";

  return (
    <div className="space-y-5">
      <PageHeader
        title="المخزون"
        subtitle={`${products.length} صنف مسجل`}
        action={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:brightness-105">
            <Plus className="size-4" /> إضافة صنف
          </button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج أو مقاس..."
              className="h-10 w-full rounded-lg border border-input bg-background pe-9 ps-3 text-sm outline-none focus:border-ring"
            />
          </div>
          <select className={select} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">الفئة: الكل</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select className={select} value={thick} onChange={(e) => setThick(e.target.value)}>
            <option value="all">السماكة: الكل</option>
            {thicknesses.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select className={select} value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">حالة المخزون: الكل</option>
            <option value="متوفر">متوفر</option>
            <option value="منخفض">منخفض</option>
            <option value="نافذ">نافذ</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["الصنف", "المقاس", "السماكة", "الطول", "الكمية", "الوزن", "الحالة"].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer transition hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="num px-4 py-3">{p.size}</td>
                  <td className="px-4 py-3">{p.thickness}</td>
                  <td className="px-4 py-3">{p.length}</td>
                  <td className="num px-4 py-3">{p.qty} قطعة</td>
                  <td className="num px-4 py-3">{kg(p.qty * p.unitWeight)} كجم</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusOf(p)} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    لا توجد أصناف مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ProductDrawer product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-steel/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-md animate-in slide-in-from-left overflow-y-auto border-e border-border bg-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              {product.name} {product.size}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <dl className="mt-6 space-y-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
          {[
            ["المقاس", product.size],
            ["السماكة", product.thickness],
            ["الطول", product.length],
            ["وزن القطعة", `${product.unitWeight} كجم`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="num font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground">المخزون</div>
            <div className="num mt-1 text-xl font-bold">{product.qty} قطعة</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="text-xs text-muted-foreground">إجمالي الوزن</div>
            <div className="num mt-1 text-xl font-bold">
              {kg(product.qty * product.unitWeight)} كجم
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-primary/15 p-4">
          <div className="text-xs font-semibold text-primary">سعر البيع</div>
          <div className="num mt-1 text-2xl font-bold">{egp(product.price)} ج.م / كجم</div>
        </div>

        <h3 className="mt-6 text-sm font-bold">حركة المخزون</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between rounded-lg border border-border px-3 py-2">
            <span>شراء</span>
            <span className="num font-semibold text-success">+100</span>
          </li>
          <li className="flex justify-between rounded-lg border border-border px-3 py-2">
            <span>بيع</span>
            <span className="num font-semibold text-destructive">-20</span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
