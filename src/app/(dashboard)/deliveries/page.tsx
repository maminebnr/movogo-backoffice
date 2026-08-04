"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_TODAY_DELIVERIES, GET_ACTIVE_DELIVERIES, GET_ALL_DELIVERIES } from "@/lib/graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadgeProps } from "@/lib/badge-utils";

type DeliveryRow = {
  _id: string;
  status?: string;
  senderId?: string;
  senderName?: string;
  carrierId?: string;
  carrierName?: string;
  totalPrice?: number;
  deliveryOption?: string;
  createdAt?: string;
};

function rowsFrom(data: unknown, key: string): DeliveryRow[] {
  if (!data || typeof data !== "object") return [];
  const value = (data as Record<string, unknown>)[key];
  return Array.isArray(value) ? (value as DeliveryRow[]) : [];
}

function DeliveryTable({
  rows,
  loading,
  errorMessage,
  showCreatedAt = false,
}: {
  rows: DeliveryRow[];
  loading: boolean;
  errorMessage?: string;
  showCreatedAt?: boolean;
}) {
  const cols = showCreatedAt ? 6 : 5;

  if (loading && rows.length === 0) {
    return <div className="text-center py-8 text-zinc-500">Loading...</div>;
  }
  if (errorMessage && rows.length === 0) {
    return <div className="text-center py-8 text-red-500">Error: {errorMessage}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Sender</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Option</TableHead>
          {showCreatedAt && <TableHead>Created</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((delivery) => {
            const badge = getStatusBadgeProps(delivery.status);
            return (
              <TableRow key={delivery._id}>
                <TableCell>
                  <Badge variant={badge.variant} className={badge.className}>
                    {delivery.status || "—"}
                  </Badge>
                </TableCell>
                <TableCell>{delivery.senderName || delivery.senderId || "—"}</TableCell>
                <TableCell>{delivery.carrierName || delivery.carrierId || "—"}</TableCell>
                <TableCell>
                  {typeof delivery.totalPrice === "number"
                    ? `${delivery.totalPrice.toFixed(2)} TND`
                    : "—"}
                </TableCell>
                <TableCell>{delivery.deliveryOption || "—"}</TableCell>
                {showCreatedAt && (
                  <TableCell>
                    {delivery.createdAt
                      ? new Date(delivery.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>
                )}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={cols} className="text-center text-zinc-500">
              No deliveries found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function DeliveriesPage() {
  const {
    data: todayData,
    loading: todayLoading,
    error: todayError,
  } = useQuery(GET_TODAY_DELIVERIES);
  const {
    data: activeData,
    loading: activeLoading,
    error: activeError,
  } = useQuery(GET_ACTIVE_DELIVERIES);
  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useQuery(GET_ALL_DELIVERIES);

  const today = rowsFrom(todayData, "todaysDeliveries");
  const active = rowsFrom(activeData, "availableDeliveries");
  const all = rowsFrom(allData, "getAllDeliveries");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliveries</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({all.length})</TabsTrigger>
            <TabsTrigger value="today">Today ({today.length})</TabsTrigger>
            <TabsTrigger value="active">Available ({active.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DeliveryTable
              rows={all}
              loading={allLoading}
              errorMessage={allError?.message}
              showCreatedAt
            />
          </TabsContent>
          <TabsContent value="today" className="mt-4">
            <DeliveryTable
              rows={today}
              loading={todayLoading}
              errorMessage={todayError?.message}
              showCreatedAt
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <DeliveryTable
              rows={active}
              loading={activeLoading}
              errorMessage={activeError?.message}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
