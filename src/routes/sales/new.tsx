import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { customers, egp, kg, type InvoiceLine } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales/new")({
  head: () => ({
    meta: [
      { title: "فاتورة جديدة | فهمي ستيل" },
      {
        name: "description",
        content: "إنشاء فاتورة بيع: اختيار العميل والأصناف وحساب الوزن والإجمالي تلقائياً.",
      },
      { property: "og:title", content: "فاتورة جديدة | فهمي ستيل" },
      { property: "og:description", content: "إنشاء فاتورة بيع وحساب الوزن والإجمالي تلقائياً." },
    ],
  }),
  component: NewInvoice,
});

const payments = ["نقدي", "آجل", "تحويل"] as const;

function NewInvoice() {
  const { products, addInvoice } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(customers[0].name);
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<string>("");
  const [qty, setQty] = useState(50);
  const [lines, setLines] = useState<InvoiceLine[]>([]);
  const [payment, setPayment] = useState<(typeof payments)[number]>("نقدي");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [paid, setPaid] = useState(0);

  const results = useMemo(
    () =>
      q.trim()
        ? products.filter((p) => `${p.name} ${p.size} ${p.thickness}`.includes(q.trim())).slice(0, 6)
        : [],
    [q, products],
  );

  const selected = products.find((p) => p.id === pick);
  const lineWeight = selected ? selected.unitWeight * qty : 0;
  const lineTotal = selected ? lineWeight * selected.price : 0;

  const gross = lines.reduce((s, l) => s + l.qty * l.unitWeight * l.price, 0);
  const totalWeight = lines.reduce((s, l) => s + l.qty * l.unitWeight, 0);
  const total = gross - discount + shipping;
  const remaining = total - paid;

  const addLine = () => {
    if (!selected || qty <= 0) return;
    setLines((prev) => [
      ...prev,
      {
        productId: selected.id,
        name: `${selected.name} ${selected.size} — سماكة ${selected.thickness}`,
        size: selected.size,
        qty,
        unitWeight: selected.unitWeight,
        price: selected.price,
      },
    ]);
    setPick("");
    setQ("");
    setQty(50);
  };

  const save = () => {
    if (lines.length === 0) {
      toast.error("أضف صنفاً واحداً على الأقل");
      return;
    }
    const inv = addInvoice({ customer, lines, payment, discount, shipping, paid });
    toast.success("تم حفظ الفاتورة بنجاح", { description: `${inv.id} — ${egp(inv.total)} ج.م` });
    navigate({ to: "/sales" });
  };

  const field =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

  return (
    <div className="space-y-5">
      <PageHeader title="فاتورة جديدة" subtitle="اختر العميل والأصناف — يتم حساب الوزن والإجمالي تلقائياً" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <h2 className="mb-3 text-base font-bold">العميل</h2>
            <select className={field} value={customer} onChange={(e) => setCustomer(e.target.value)}>
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <h2 className="mb-3 text-base font-bold">المنتجات</h2>

            <div className="relative">
              <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPick("");
                }}
                placeholder="ابحث عن صنف أو مقاس"
                className={cn(field, "pe-9")}
              />
              {results.length > 0 && !pick && (
                <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lift">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          setPick(p.id);
                          setQ(`${p.name} ${p.size} — سماكة ${p.thickness}`);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-start text-sm transition hover:bg-muted"
                      >
                        <span className="font-medium">
                          {p.name} {p.size} — سماكة {p.thickness}
                        </span>
                        <span className="num text-xs text-muted-foreground">{p.qty} قطعة</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selected && (
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                      الكمية (قطعة)
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className={field}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Mini label="وزن القطعة" value={`${selected.unitWeight} كجم`} />
                    <Mini label="إجمالي الوزن" value={`${kg(lineWeight)} كجم`} strong />
                    <Mini label="سعر الكيلو" value={`${selected.price} ج.م`} />
                    <Mini label="الإجمالي" value={`${egp(lineTotal)} ج.م`} strong />
                  </div>
                </div>
                <button
                  onClick={addLine}
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-steel px-4 text-sm font-bold text-steel-foreground transition hover:opacity-90"
                >
                  <Plus className="size-4" /> إضافة للفاتورة
                </button>
              </div>
            )}

            {lines.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      {["الصنف", "الكمية", "الوزن", "سعر الكيلو", "الإجمالي", ""].map((h) => (
                        <th key={h} className="pb-2 text-start font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {lines.map((l, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-medium">{l.name}</td>
                        <td className="num py-2.5">{l.qty}</td>
                        <td className="num py-2.5">{kg(l.qty * l.unitWeight)} كجم</td>
                        <td className="num py-2.5">{l.price}</td>
                        <td className="num py-2.5 font-semibold">
                          {egp(l.qty * l.unitWeight * l.price)}
                        </td>
                        <td className="py-2.5 text-end">
                          <button
                            onClick={() => setLines((prev) => prev.filter((_, x) => x !== i))}
                            className="text-muted-foreground transition hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <h2 className="mb-3 text-base font-bold">طريقة الدفع</h2>
            <div className="grid grid-cols-3 gap-2">
              {payments.map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={cn(
                    "h-10 rounded-lg border text-sm font-semibold transition",
                    payment === p
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <h2 className="mb-4 text-base font-bold">ملخص الفاتورة</h2>
            <div className="space-y-3 text-sm">
              <Row label="إجمالي الوزن" value={`${kg(totalWeight)} كجم`} />
              <Row label="الإجمالي" value={`${egp(gross)} ج.م`} />
              <NumRow label="الخصم" value={discount} onChange={setDiscount} />
              <NumRow label="النقل" value={shipping} onChange={setShipping} />
              <NumRow label="المدفوع" value={paid} onChange={setPaid} />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                <span className="font-bold">المتبقي</span>
                <span className="num text-lg font-bold text-primary">{egp(remaining)} ج.م</span>
              </div>
            </div>
            <button
              onClick={save}
              className="mt-5 h-12 w-full rounded-lg bg-primary text-sm font-extrabold text-primary-foreground transition hover:brightness-105"
            >
              حفظ الفاتورة
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Mini({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg bg-card px-3 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("num mt-0.5", strong ? "text-base font-bold" : "font-semibold")}>{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="num font-semibold">{value}</span>
    </div>
  );
}

function NumRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="num h-9 w-28 rounded-lg border border-input bg-background px-2 text-end text-sm outline-none focus:border-ring"
      />
    </div>
  );
}
