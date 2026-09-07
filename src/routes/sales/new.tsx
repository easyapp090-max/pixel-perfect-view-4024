import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { customers, egp, kg, type InvoiceLine, type Invoice } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales/new")({
  head: () => ({
    meta: [
      { title: "فاتورة جديدة | فهمي ستيل" },
      { name: "description", content: "إنشاء فاتورة بيع: اختيار العميل والأصناف وحساب الوزن والإجمالي." },
      { property: "og:title", content: "فاتورة جديدة | فهمي ستيل" },
      { property: "og:description", content: "إنشاء فاتورة بيع وحساب الوزن والإجمالي تلقائياً." },
    ],
  }),
  component: NewInvoice;
});

function NewInvoice() {
  return null;
}
