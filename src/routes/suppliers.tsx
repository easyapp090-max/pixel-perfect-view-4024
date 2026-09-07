import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-layout";
import { egp, suppliers } from "@/lib/demo-data";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "الموردين | فهمي ستيل" },
      { name: "description", content: "قائمة موردي الحديد والأرصدة وآخر التعاملات." },
      { property: "og:title", content: "الموردين | فهمي ستيل" },
      { property: "og:description", content: "موردو الحديد والأرصدة المستحقة." },
    ],
  }),
  component: Suppliers,
});

function Suppliers() {
  return (
    <div className="space-y-5">
      <PageHeader title="الموردين" subtitle="أرصدة الموردين وآخر التعاملات" />
      <div className="grid gap-4 md:grid-cols-3">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-panel">
            <h2 className="text-base font-bold">{s.name}</h2>
            <p className="num mt-1 text-sm text-muted-foreground">{s.phone}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-xs text-muted-foreground">الرصيد المستحق</div>
                <div className="num mt-1 text-xl font-bold">{egp(s.balance)} ج.م</div>
              </div>
              <div className="text-end">
                <div className="text-xs text-muted-foreground">آخر توريد</div>
                <div className="num mt-1 font-semibold">{s.lastDeal}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
