import { Header, Footer } from "@/components/Header";
import { SEASONAL_PRODUCE, MONTH_NAMES } from "@/data/seasonal-produce";

export const metadata = {
  title: "What's in season | Seasonal Plate",
};

export default function SeasonalPage() {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-emerald-950">British seasonal calendar</h1>
        <p className="mt-2 max-w-2xl text-emerald-700">
          Eating with the seasons means better taste, lower prices, and supporting local
          growers. Here&apos;s what&apos;s typically available across the UK growing year.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MONTH_NAMES.map((name, idx) => {
            const month = idx + 1;
            const items = SEASONAL_PRODUCE.filter((p) => p.months.includes(month));
            const peak = items.filter((p) => p.peak?.includes(month));
            const isCurrent = month === currentMonth;

            return (
              <div
                key={name}
                className={`rounded-2xl border p-5 ${
                  isCurrent
                    ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"
                    : "border-emerald-100 bg-white"
                }`}
              >
                <h2 className="font-semibold text-emerald-950">
                  {name}
                  {isCurrent && (
                    <span className="ml-2 text-xs font-normal text-emerald-600">
                      (now)
                    </span>
                  )}
                </h2>
                {peak.length > 0 && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Peak: {peak.map((p) => p.name).join(", ")}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item.name}
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        item.peak?.includes(month)
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
