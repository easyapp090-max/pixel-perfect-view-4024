import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Clock3, Wallet, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { KpiCard, StatusBadge } from "@/components/kpi-card";
import { customers, egp, type Customer } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "العملاء | فهمي ستيل" },
      { name: "description", content: "بيانات العملاء، المشتريات، المدفوعات والأرصدة المتبقية." },
      { property: "og:title", content: "العملاء | فهمي ستيل" },
      { property: "og:description", content: "أرصدة العملاء وكشوف الحساب في فهمي ستيل." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [open, setOpen] = useState<Customer | null>(null);
  const debt = customers.reduce((s, c) => s + (c.purchases - c.paid), 0);
  const credit = customers.filter((c) => c.purchases > c.paid).length;

  return (
    <div className="space-y-5">
      <PageHeader title="العملاء" subtitle="متابعة أرصدة العملاء والمديونيات" />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="إجمالي العملاء" value={String(customers.length)} icon={Users} />
        <KpiCard label="العملاء الآجل" value={String(credit)} icon={Clock3} tone="warning" />
        <KpiCard label="إجمالي المديونية" value={egp(debt)} unit="ج.م" icon={Wallet} tone="primary" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["اسم العميل", "الهاتف", "المشتريات", "المدفوع", "المتبقي"].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setOpen(c)}
                  className="cursor-pointer transition hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="num px-4 py-3 text-muted-foreground">{c.phone}</td>
                  <td className="num px-4 py-3">{egp(c.purchases)}</td>
                  <td className="num px-4 py-3">{egp(c.paid)}</td>
                  <td className="num px-4 py-3 font-bold text-primary">
                    {egp(c.purchases - c.paid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <CustomerDrawer customer={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { invoices } = useStore();
  const own = invoices.filter((i) => i.customer === customer.name);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-steel/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-md animate-in slide-in-from-left overflow-y-auto border-e border-border bg-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <p className="num mt-1 text-sm text-muted-foreground">{customer.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["المشتريات", customer.purchases],
            ["المدفوع", customer.paid],
            ["الرصيد", customer.purchases - customer.paid],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl border border-border p-3">
              <div className="text-[11px] text-muted-foreground">{k}</div>
              <div className="num mt-1 text-sm font-bold">{egp(v as number)}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-bold">آخر الفواتير</h3>
        <ul className="mt-3 space-y-2">
          {own.length === 0 && <li className="text-sm text-muted-foreground">لا توجد فواتير</li>}
          {own.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm"
            >
              <div>
                <div className="num font-semibold">{i.id}</div>
                <div className="num text-xs text-muted-foreground">{i.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="num font-semibold">{egp(i.total)} ج.م</span>
                <StatusBadge status={i.status} />
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-bold">الدفعات</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between rounded-lg border border-border px-3 py-2">
            <span>تحويل بنكي</span>
            <span className="num font-semibold text-success">+60,000</span>
          </li>
          <li className="flex justify-between rounded-lg border border-border px-3 py-2">
            <span>نقدي</span>
            <span className="num font-semibold text-success">+35,000</span>
          </li>
        </ul>

        <button className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition hover:brightness-105">
          <FileText className="size-4" /> كشف الحساب
        </button>
      </aside>
    </div>
  );
}
