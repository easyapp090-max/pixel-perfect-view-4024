import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Receipt,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "الرئيسية", en: "Dashboard", icon: LayoutDashboard },
  { to: "/sales", label: "المبيعات", en: "Sales", icon: Receipt },
  { to: "/inventory", label: "المخزون", en: "Inventory", icon: Boxes },
  { to: "/purchases", label: "المشتريات", en: "Purchases", icon: ShoppingCart },
  { to: "/customers", label: "العملاء", en: "Customers", icon: Users },
  { to: "/suppliers", label: "الموردين", en: "Suppliers", icon: Truck },
  { to: "/cashbox", label: "الخزنة", en: "Cashbox", icon: Wallet },
  { to: "/reports", label: "التقارير", en: "Reports", icon: BarChart3 },
  { to: "/settings", label: "الإعدادات", en: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { lang, setLang } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div dir="rtl" className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-steel text-steel-foreground md:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-extrabold">ف</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold">فهمي ستيل</div>
            <div className="text-[11px] tracking-[0.18em] text-steel-muted">FAHMY STEEL</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-steel-muted hover:bg-white/5 hover:text-steel-foreground",
                )}
              >
                <item.icon className="size-[18px]" />
                <span>{lang === "ar" ? item.label : item.en}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl bg-white/5 p-3">
          <div className="text-sm font-semibold">مدير النظام</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-steel-muted">
            <span className="size-2 rounded-full bg-success" />
            متصل الآن
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="relative w-full max-w-sm">
            <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="بحث سريع عن فاتورة أو عميل أو صنف..."
              className="h-10 w-full rounded-lg border border-input bg-background pe-9 ps-3 text-sm outline-none transition focus:border-ring"
            />
          </div>
          <div className="ms-auto flex items-center gap-2">
            <button className="grid size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground">
              <Bell className="size-4" />
            </button>
            <div className="flex overflow-hidden rounded-lg border border-border text-xs font-semibold">
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-2 transition",
                    lang === l ? "bg-steel text-steel-foreground" : "bg-card text-muted-foreground",
                  )}
                >
                  {l === "ar" ? "عربي" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold md:text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
