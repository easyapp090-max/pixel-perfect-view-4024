import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Boxes, Users, Truck, Wallet, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "التقارير | فهمي ستيل" },
      { name: "description", content: "تقارير المبيعات والمخزون والعملاء والموردين والخزنة والأرباح." },
      { property: "og:title", content: "التقارير | فهمي ستيل" },
      { property: "og:description", content: "تقارير سريعة لأداء العمل في فهمي ستيل." },
    ],
  }),
  component: Reports,
});

const reports = [
  { key: "sales", title: "المبيعات", icon: BarChart3, lines: ["إجمالي المبيعات: 1,541,800 ج.م", "عدد الفواتير: 38", "متوسط الفاتورة: 40,573 ج.م"] },
  { key: "stock", title: "المخزون", icon: Boxes, lines: ["قيمة المخزون: 4.82 مليون ج.م", "إجمالي الوزن: 92,400 كجم", "أصناف منخفضة: 3"] },
  { key: "customers", title: "العملاء", icon: Users, lines: ["عدد العملاء: 4", "إجمالي المديونية: 1,246,600 ج.م", "أعلى عميل: المتحدة للمقاولات"] },
  { key: "suppliers", title: "الموردين", icon: Truck, lines: ["عدد الموردين: 3", "مستحقات: 642,500 ج.م", "أعلى مورد: شركة مصر للحديد"] },
  { key: "cash", title: "الخزنة", icon: Wallet, lines: ["الرصيد: 612,480 ج.م", "مقبوضات الأسبوع: 218,360 ج.م", "مدفوعات الأسبوع: 258,400 ج.م"] },
  { key: "profit", title: "الأرباح", icon: TrendingUp, lines: ["هامش الربح: 9.4%", "ربح الشهر: 184,200 ج.م", "أعلى ربح: علب مربع"] },
];

function Reports() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <PageHeader title="التقارير" subtitle="نظرة سريعة على أداء العمل" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => {
          const active = open === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setOpen(active ? null : r.key)}
              className={cn(
                "rounded-xl border bg-card p-5 text-start shadow-panel transition hover:shadow-lift",
                active ? "border-primary" : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <r.icon className="size-5" />
                </span>
                <h2 className="text-base font-bold">{r.title}</h2>
              </div>
              {active && (
                <ul className="mt-4 space-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
                  {r.lines.map((l) => (
                    <li key={l} className="num">
                      {l}
                    </li>
                  ))}
                </ul>
              )}
              {!active && (
                <p className="mt-3 text-sm text-muted-foreground">اضغط لعرض ملخص التقرير</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
