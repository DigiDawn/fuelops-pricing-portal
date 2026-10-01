import { getAuthContext } from "@/lib/auth";
export default async function History() {
  const { supabase } = await getAuthContext();
  const { data } = await supabase
    .from("fuel_price_history")
    .select(
      "id,price,effective_at,site:fuel_sites(name),product:fuel_products(name,code),supplier:fuel_suppliers(name)",
    )
    .order("effective_at", { ascending: false })
    .limit(100);
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Historical data</p>
        <h1 className="mt-1 text-3xl font-bold">Price history</h1>
        <p className="mt-2 text-slate-500">
          Trace posted price changes and supplier sources over time.
        </p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border px-3 py-2.5 text-sm">
            <option>All sites</option>
          </select>
          <select className="rounded-xl border px-3 py-2.5 text-sm">
            <option>All products</option>
          </select>
          <input
            type="date"
            className="rounded-xl border px-3 py-2.5 text-sm"
          />
          <button className="rounded-xl border px-4 py-2.5 text-sm font-semibold">
            Download report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-400">
              <tr>
                <th className="pb-3">Effective</th>
                <th>Site</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((x: any) => (
                <tr key={x.id} className="border-b last:border-0">
                  <td className="py-3 text-slate-500">
                    {new Date(x.effective_at).toLocaleString()}
                  </td>
                  <td className="font-semibold">{x.site?.name}</td>
                  <td>{x.product?.name}</td>
                  <td>{x.supplier?.name}</td>
                  <td className="font-bold tabular-nums">
                    ${Number(x.price).toFixed(3)}
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
