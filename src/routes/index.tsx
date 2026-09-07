import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Banknote, HandCoins, Layers, Clock3, AlertTriangle, ArrowLeft } from "lucide-react";
import { KpiCard, Panel, StatusBadge } from "@/components/kpi-card";
import { PageHeader } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { egp, kg, salesTrend, topProducts } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية | فهمي ستيل" },
      { name: "description", content: "ملخص حركة العمل اليوم: المبيعات، التحصيلات، المخزون والعملاء." },
      { property: "og:title", content: "الرئيسية | فهمي ستيل" },
      { property: "og:description", content: "ملخص حركة العمل اليوم في فهمي ستيل." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { products, invoices } = useStore();
  const low = products.filter((p) => p.qty <= p.minQty).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader title="مرحباً بك في فهمي ستيل" subtitle="ملخص حركة العمل اليوم" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="مبيعات اليوم" value="245,800" unit="ج.م" icon={Banknote} tone="primary" hint="+12% عن أمس" />
        <KpiCard label="التحصيلات" value="138,500" unit="ج.م" icon={HandCoins} tone="success" />
        <KpiCard label="قيمة المخزون" value="4.82" unit="مليون ج.م" icon={Layers} />
        <KpiCard label="العملاء الآجل" value="1.36" unit="مليون ج.م" icon={Clock3} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="حركة المبيعات" className="lg:col-span-2">
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  formatter={(v: number) => [`${egp(v)} ج.م`, "المبيعات"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#sales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="أكثر المنتجات مبيعاً">
          <ul className="space-y-4">
            {topProducts.map((p) => (
              <li key={p.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="num text-muted-foreground">{p.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.value * 2.6}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="تنبيهات المخزون">
          <ul className="space-y-3">
            {low.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3"
              >
                <AlertTriangle className="size-4 shrink-0 text-warning-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {p.name} {p.size}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    متبقي <span className="num">{p.qty}</span> قطعة — الحد الأدنى{" "}
                    <span className="num">{p.minQty}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="آخر الفواتير"
          className="lg:col-span-2"
          action={
            <Link
              to="/sales"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              كل الفواتير <ArrowLeft className="size-4" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-xs text-muted-foreground">
                  <th className="pb-3 text-start font-medium">رقم الفاتورة</th>
                  <th className="pb-3 text-start font-medium">العميل</th>
                  <th className="pb-3 text-start font-medium">الوزن</th>
                  <th className="pb-3 text-start font-medium">الإجمالي</th>
                  <th className="pb-3 text-start font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id}>
                    <td className="num py-3 font-semibold">{inv.id}</td>
                    <td className="py-3">{inv.customer}</td>
                    <td className="num py-3">{kg(inv.weight)} كجم</td>
                    <td className="num py-3 font-semibold">{egp(inv.total)}</td>
                    <td className="py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
