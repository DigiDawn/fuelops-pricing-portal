import { getAuthContext } from "@/lib/auth";
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { supabase } = await getAuthContext();
  if (!q)
    return (
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="mt-2 text-slate-500">
          Search sites, suppliers, and products from the header.
        </p>
      </div>
    );
  const term = `%${q}%`;
  const [{ data: sites }, { data: suppliers }, { data: products }] =
    await Promise.all([
      supabase
        .from("fuel_sites")
        .select("id,name,code,region")
        .or(`name.ilike.${term},code.ilike.${term},region.ilike.${term}`)
        .limit(10),
      supabase
        .from("fuel_suppliers")
        .select("id,name,code,status")
        .or(`name.ilike.${term},code.ilike.${term}`)
        .limit(10),
      supabase
        .from("fuel_products")
        .select("id,name,code,grade")
        .or(`name.ilike.${term},code.ilike.${term}`)
        .limit(10),
    ]);
  return (
    <div>
      <h1 className="text-3xl font-bold">Search results</h1>
      <p className="mt-2 text-slate-500">Matches for “{q}”</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold">Sites</h2>
          {sites?.map((x: any) => (
            <div key={x.id} className="border-b py-3 last:border-0">
              <p className="font-semibold">{x.name}</p>
              <p className="text-xs text-slate-500">
                {x.code} · {x.region}
              </p>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold">Suppliers</h2>
          {suppliers?.map((x: any) => (
            <div key={x.id} className="border-b py-3 last:border-0">
              <p className="font-semibold">{x.name}</p>
              <p className="text-xs text-slate-500">
                {x.code} · {x.status}
              </p>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold">Products</h2>
          {products?.map((x: any) => (
            <div key={x.id} className="border-b py-3 last:border-0">
              <p className="font-semibold">{x.name}</p>
              <p className="text-xs text-slate-500">
                {x.code} · {x.grade}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
