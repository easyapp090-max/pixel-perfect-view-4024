import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات | فهمي ستيل" },
      { name: "description", content: "بيانات المنشأة، اللغة وإعدادات العرض في فهمي ستيل." },
      { property: "og:title", content: "الإعدادات | فهمي ستيل" },
      { property: "og:description", content: "إعدادات المنشأة واللغة." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang } = useStore();
  const field =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

  return (
    <div className="space-y-5">
      <PageHeader title="الإعدادات" subtitle="بيانات المنشأة وإعدادات العرض" />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h2 className="mb-4 text-base font-bold">بيانات المنشأة</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                اسم المنشأة
              </span>
              <input className={field} defaultValue="فهمي ستيل — Fahmy Steel" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">الهاتف</span>
              <input className={cn(field, "num")} defaultValue="0100 000 0000" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">العنوان</span>
              <input className={field} defaultValue="المنطقة الصناعية" />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h2 className="mb-4 text-base font-bold">اللغة</h2>
          <div className="flex gap-2">
            {(["ar", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "h-11 flex-1 rounded-lg border text-sm font-bold transition",
                  lang === l
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {l === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            هذه نسخة تجريبية للعرض — البيانات محلية فقط.
          </p>
        </section>
      </div>
    </div>
  );
}
