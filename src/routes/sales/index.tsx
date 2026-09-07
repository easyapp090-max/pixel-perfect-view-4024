import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { StatusBadge } from "@/components/kpi-card";
import { useStore } from "@/lib/store";
import { egp, kg } from "@/lib/demo-data";

export const Route = createFileRoute("/sales/")({
  head: () => ({
    meta: [
      { title: "المبيعات | فهمي ستيل" },
      { name: "description", content: "فواتير البيع، الأوزان، طرق الدفع وحالة التحصيل." },
      { property: "og:title", content: "المبيعات | فهمي ستيل" },
      { property: "og:description", content: "فواتير البيع وحالة التحصيل في فهمي ستيل." },
    ],
  }),
  component: Sales,
});

function Sales() {
  const { invoices } = useStore();

  return (
    <div className="space-y-5">
      <PageHeader
        title="المبيعات"
        subtitle={`${invoices.length} فاتورة`}
        action={
          <Link
            to="/sales/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:brightness-105"
          >
            <Plus className="size-4" /> فاتورة جديدة
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["رقم الفاتورة", "العميل", "التاريخ", "الوزن", "الإجمالي", "طريقة الدفع", "الحالة"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-start font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-muted/50">
                  <td className="num px-4 py-3 font-semibold">{inv.id}</td>
                  <td className="px-4 py-3">{inv.customer}</td>
                  <td className="num px-4 py-3 text-muted-foreground">{inv.date}</td>
                  <td className="num px-4 py-3">{kg(inv.weight)} كجم</td>
                  <td className="num px-4 py-3 font-semibold">{egp(inv.total)} ج.م</td>
                  <td className="px-4 py-3">{inv.payment}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
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
