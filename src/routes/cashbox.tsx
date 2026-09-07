import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { KpiCard } from "@/components/kpi-card";
import { cashTransactions, egp } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cashbox")({
  head: () => ({
    meta: [
      { title: "الخزنة | فهمي ستيل" },
      { name: "description", content: "رصيد الخزنة، المقبوضات، المدفوعات ومصروفات اليوم." },
      { property: "og:title", content: "الخزنة | فهمي ستيل" },
      { property: "og:description", content: "حركة الخزنة اليومية في فهمي ستيل." },
    ],
  }),
  component: Cashbox,
});

function Cashbox() {
  const inflow = cashTransactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outflow = cashTransactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);

  return (
    <div className="space-y-5">
      <PageHeader title="الخزنة" subtitle="حركة النقدية اليومية" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="رصيد الخزنة" value="612,480" unit="ج.م" icon={Wallet} tone="primary" />
        <KpiCard label="المقبوضات" value={egp(inflow)} unit="ج.م" icon={ArrowDownLeft} tone="success" />
        <KpiCard label="المدفوعات" value={egp(outflow)} unit="ج.م" icon={ArrowUpRight} />
        <KpiCard label="مصروفات اليوم" value="8,400" unit="ج.م" icon={Receipt} tone="warning" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["النوع", "البيان", "التاريخ", "المبلغ"].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cashTransactions.map((t) => (
                <tr key={t.id} className="transition hover:bg-muted/50">
                  <td className="px-4 py-3 font-semibold">{t.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.desc}</td>
                  <td className="num px-4 py-3 text-muted-foreground">{t.date}</td>
                  <td
                    className={cn(
                      "num px-4 py-3 font-bold",
                      t.amount > 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {t.amount > 0 ? "+" : "-"}
                    {egp(Math.abs(t.amount))} ج.م
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
