export type Product = {
  id: string;
  name: string;
  category: "مربع" | "مستطيل" | "مدور" | "بيضاوي" | "خوص" | "زوايا";
  size: string;
  thickness: string;
  length: string;
  unitWeight: number; // كجم للقطعة
  qty: number; // عدد القطع
  price: number; // ج.م / كجم
  minQty: number;
};

export type InvoiceLine = {
  productId: string;
  name: string;
  size: string;
  qty: number;
  unitWeight: number;
  price: number;
};

export type Invoice = {
  id: string;
  customer: string;
  date: string;
  weight: number;
  total: number;
  payment: "نقدي" | "آجل" | "تحويل";
  status: "مدفوعة" | "جزئي" | "غير مدفوعة";
  lines?: InvoiceLine[];
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  purchases: number;
  paid: number;
};

export const products: Product[] = [
  { id: "p1", name: "علب مربع", category: "مربع", size: "4×4", thickness: "1.5 مم", length: "6 متر", unitWeight: 7.4, qty: 120, price: 52, minQty: 60 },
  { id: "p2", name: "علب مربع", category: "مربع", size: "5×5", thickness: "2 مم", length: "6 متر", unitWeight: 12.3, qty: 84, price: 52, minQty: 50 },
  { id: "p3", name: "علب مربع", category: "مربع", size: "3×3", thickness: "1.25 مم", length: "6 متر", unitWeight: 4.6, qty: 38, price: 53, minQty: 60 },
  { id: "p4", name: "علب مستطيل", category: "مستطيل", size: "4×6", thickness: "1.5 مم", length: "6 متر", unitWeight: 9.2, qty: 96, price: 52, minQty: 50 },
  { id: "p5", name: "علب مستطيل", category: "مستطيل", size: "4×8", thickness: "2 مم", length: "6 متر", unitWeight: 14.6, qty: 22, price: 52.5, minQty: 40 },
  { id: "p6", name: "مدور", category: "مدور", size: "76 مم", thickness: "2 مم", length: "6 متر", unitWeight: 21.9, qty: 64, price: 54, minQty: 30 },
  { id: "p7", name: "مدور", category: "مدور", size: "48 مم", thickness: "1.5 مم", length: "6 متر", unitWeight: 10.3, qty: 71, price: 54, minQty: 30 },
  { id: "p8", name: "بيضاوي", category: "بيضاوي", size: "50×25", thickness: "1.5 مم", length: "6 متر", unitWeight: 8.1, qty: 45, price: 55, minQty: 25 },
  { id: "p9", name: "خوص", category: "خوص", size: "40×6", thickness: "6 مم", length: "6 متر", unitWeight: 11.3, qty: 58, price: 51, minQty: 30 },
  { id: "p10", name: "زاوية", category: "زوايا", size: "40×40", thickness: "4 مم", length: "6 متر", unitWeight: 14.4, qty: 14, price: 51.5, minQty: 30 },
  { id: "p11", name: "زاوية", category: "زوايا", size: "30×30", thickness: "3 مم", length: "6 متر", unitWeight: 8.2, qty: 52, price: 51.5, minQty: 25 },
];

export const customers: Customer[] = [
  { id: "c1", name: "شركة النور للمقاولات", phone: "0100 224 8871", purchases: 986400, paid: 742000 },
  { id: "c2", name: "مؤسسة السلام للحديد", phone: "0111 553 2094", purchases: 612300, paid: 612300 },
  { id: "c3", name: "المتحدة للمقاولات", phone: "0122 908 4417", purchases: 1184900, paid: 730500 },
  { id: "c4", name: "مصنع المستقبل", phone: "0128 447 1120", purchases: 398700, paid: 251200 },
];

export const suppliers = [
  { id: "s1", name: "شركة مصر للحديد", phone: "02 2456 7781", balance: 480000, lastDeal: "1445 طن" },
  { id: "s2", name: "المتحدة لتجارة الحديد", phone: "02 3391 2205", balance: 162500, lastDeal: "820 طن" },
  { id: "s3", name: "النيل للصلب", phone: "02 2748 6630", balance: 0, lastDeal: "310 طن" },
];

export const initialInvoices: Invoice[] = [
  { id: "INV-2418", customer: "شركة النور للمقاولات", date: "2026-09-07", weight: 1840, total: 95680, payment: "آجل", status: "جزئي" },
  { id: "INV-2417", customer: "مصنع المستقبل", date: "2026-09-07", weight: 620, total: 32240, payment: "نقدي", status: "مدفوعة" },
  { id: "INV-2416", customer: "المتحدة للمقاولات", date: "2026-09-06", weight: 2410, total: 126120, payment: "تحويل", status: "مدفوعة" },
  { id: "INV-2415", customer: "مؤسسة السلام للحديد", date: "2026-09-06", weight: 980, total: 51940, payment: "آجل", status: "غير مدفوعة" },
  { id: "INV-2414", customer: "شركة النور للمقاولات", date: "2026-09-05", weight: 1520, total: 79040, payment: "نقدي", status: "مدفوعة" },
];

export const purchases = [
  { id: "PUR-812", supplier: "شركة مصر للحديد", date: "2026-09-06", weight: 24500, total: 1151500, status: "مدفوعة" },
  { id: "PUR-811", supplier: "المتحدة لتجارة الحديد", date: "2026-09-04", weight: 12800, total: 601600, status: "جزئي" },
  { id: "PUR-810", supplier: "النيل للصلب", date: "2026-09-01", weight: 8600, total: 404200, status: "مدفوعة" },
];

export const cashTransactions = [
  { id: "t1", type: "مقبوضات", desc: "تحصيل فاتورة INV-2417", date: "2026-09-07", amount: 32240 },
  { id: "t2", type: "مقبوضات", desc: "دفعة من شركة النور للمقاولات", date: "2026-09-07", amount: 60000 },
  { id: "t3", type: "مدفوعات", desc: "سداد شركة مصر للحديد", date: "2026-09-07", amount: -250000 },
  { id: "t4", type: "مصروفات", desc: "نقل وأوناش", date: "2026-09-07", amount: -8400 },
  { id: "t5", type: "مقبوضات", desc: "تحصيل فاتورة INV-2416", date: "2026-09-06", amount: 126120 },
];

export const salesTrend = [
  { day: "السبت", value: 168000 },
  { day: "الأحد", value: 212000 },
  { day: "الاثنين", value: 145000 },
  { day: "الثلاثاء", value: 268000 },
  { day: "الأربعاء", value: 198000 },
  { day: "الخميس", value: 305000 },
  { day: "الجمعة", value: 245800 },
];

export const topProducts = [
  { name: "علب مربع", value: 34 },
  { name: "علب مستطيل", value: 26 },
  { name: "مدور", value: 17 },
  { name: "خوص", value: 13 },
  { name: "زوايا", value: 10 },
];

export const egp = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export const kg = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
