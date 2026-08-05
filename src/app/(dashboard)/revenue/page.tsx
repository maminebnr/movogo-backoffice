"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_APP_GAIN_AND_FUNDS } from "@/lib/graphql/queries";
import { Input } from "@/components/ui/input";

type RevenueRow = {
  _id: string;
  deliveryId: string;
  carrierId: string;
  totalPrice: number;
  appGain: number;
  carrierGain: number;
  date: string;
  distanceKm?: number;
  deliveryOption?: string;
};

export default function RevenuePage() {
  const { data, loading, error } = useQuery(GET_APP_GAIN_AND_FUNDS);
  const [search, setSearch] = useState("");

  const rows: RevenueRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getAppGainHistory)
      ? ((data as any).getAppGainHistory as RevenueRow[])
      : [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.deliveryId?.toLowerCase().includes(q) ||
        row.deliveryOption?.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, row) => {
        acc.totalPrice += row.totalPrice || 0;
        acc.appGain += row.appGain || 0;
        acc.carrierGain += row.carrierGain || 0;
        acc.distanceKm += row.distanceKm || 0;
        return acc;
      },
      { totalPrice: 0, appGain: 0, carrierGain: 0, distanceKm: 0 },
    );
  }, [filtered]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>Revenue ({filtered.length}/{rows.length})</CardTitle>
        <Input
          className="max-w-xs"
          placeholder="Search delivery ID or option..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center py-8 text-zinc-500">Loading...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error.message}</div>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border bg-orange-50 border-orange-200 px-4 py-3">
                <div className="text-xs text-orange-700">Total revenue</div>
                <div className="text-lg font-semibold text-orange-900">
                  {totals.totalPrice.toFixed(2)} TND
                </div>
              </div>
              <div className="rounded-lg border bg-zinc-50 px-4 py-3">
                <div className="text-xs text-zinc-500">App gain</div>
                <div className="text-lg font-semibold">{totals.appGain.toFixed(2)} TND</div>
              </div>
              <div className="rounded-lg border bg-zinc-50 px-4 py-3">
                <div className="text-xs text-zinc-500">Carrier gain</div>
                <div className="text-lg font-semibold">{totals.carrierGain.toFixed(2)} TND</div>
              </div>
              <div className="rounded-lg border bg-zinc-50 px-4 py-3">
                <div className="text-xs text-zinc-500">Total distance</div>
                <div className="text-lg font-semibold">{totals.distanceKm.toFixed(1)} km</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Carrier ID</TableHead>
                  <TableHead>Total price</TableHead>
                  <TableHead>App gain</TableHead>
                  <TableHead>Carrier gain</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Option</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        {row.date ? new Date(row.date).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.deliveryId ? row.deliveryId.slice(-8) : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.carrierId ? row.carrierId.slice(-8) : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof row.totalPrice === "number" ? `${row.totalPrice.toFixed(2)} TND` : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof row.appGain === "number" ? `${row.appGain.toFixed(2)} TND` : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof row.carrierGain === "number"
                          ? `${row.carrierGain.toFixed(2)} TND`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof row.distanceKm === "number" ? `${row.distanceKm.toFixed(1)} km` : "—"}
                      </TableCell>
                      <TableCell>{row.deliveryOption || "—"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-zinc-500">
                      No revenue records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
