"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_TODAY_DELIVERIES, GET_ACTIVE_DELIVERIES, GET_ALL_DELIVERIES } from "@/lib/graphql/queries";
import { ADMIN_CANCEL_DELIVERY, ADMIN_CHANGE_DELIVERY_STATUS } from "@/lib/graphql/mutations";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadgeProps } from "@/lib/badge-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ban, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "OrderConfirmed",
  "CarrierAssigned",
  "OnTheWayToPickup",
  "ArrivedAtPickup",
  "OnTheWayToDropoff",
  "ArrivedAtDropoff",
  "PackageDelivered",
] as const;

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
  onCancel,
  onChangeStatus,
}: {
  rows: DeliveryRow[];
  loading: boolean;
  errorMessage?: string;
  showCreatedAt?: boolean;
  onCancel: (d: DeliveryRow) => void;
  onChangeStatus: (d: DeliveryRow) => void;
}) {
  const cols = showCreatedAt ? 7 : 6;

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
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((delivery) => {
            const badge = getStatusBadgeProps(delivery.status);
            const terminal =
              delivery.status === "PackageDelivered" || delivery.status === "Cancelled";
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
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                      title="Change status"
                      disabled={delivery.status === "Cancelled"}
                      onClick={() => onChangeStatus(delivery)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                      title="Cancel delivery"
                      disabled={terminal}
                      onClick={() => onCancel(delivery)}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
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
    refetch: refetchToday,
  } = useQuery(GET_TODAY_DELIVERIES);
  const {
    data: activeData,
    loading: activeLoading,
    error: activeError,
    refetch: refetchActive,
  } = useQuery(GET_ACTIVE_DELIVERIES);
  const {
    data: allData,
    loading: allLoading,
    error: allError,
    refetch: refetchAll,
  } = useQuery(GET_ALL_DELIVERIES);

  const today = rowsFrom(todayData, "todaysDeliveries");
  const active = rowsFrom(activeData, "availableDeliveries");
  const all = rowsFrom(allData, "getAllDeliveries");

  const [selected, setSelected] = useState<DeliveryRow | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [nextStatus, setNextStatus] = useState<string>("OrderConfirmed");

  const refetchAllTabs = () => {
    refetchToday();
    refetchActive();
    refetchAll();
  };

  const [cancelDelivery, { loading: cancelling }] = useMutation(ADMIN_CANCEL_DELIVERY, {
    onCompleted: () => {
      toast.success("Delivery cancelled");
      setCancelOpen(false);
      setCancelReason("");
      refetchAllTabs();
    },
    onError: (err) => toast.error(err.message || "Cancel failed"),
  });

  const [changeStatus, { loading: changing }] = useMutation(ADMIN_CHANGE_DELIVERY_STATUS, {
    onCompleted: (res: any) => {
      toast.success(`Status set to ${res.adminChangeDeliveryStatus.status}`);
      setStatusOpen(false);
      refetchAllTabs();
    },
    onError: (err) => toast.error(err.message || "Status update failed"),
  });

  const openCancel = (d: DeliveryRow) => {
    setSelected(d);
    setCancelReason("");
    setCancelOpen(true);
  };

  const openStatus = (d: DeliveryRow) => {
    setSelected(d);
    setNextStatus(
      d.status && d.status !== "Cancelled" ? d.status : "OrderConfirmed",
    );
    setStatusOpen(true);
  };

  const submitCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await cancelDelivery({
      variables: {
        input: {
          deliveryId: selected._id,
          cancelReason: cancelReason || undefined,
        },
      },
    });
  };

  const submitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await changeStatus({
      variables: {
        input: { deliveryId: selected._id, status: nextStatus },
      },
    });
  };

  const tableProps = {
    onCancel: openCancel,
    onChangeStatus: openStatus,
  };

  return (
    <>
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
                {...tableProps}
              />
            </TabsContent>
            <TabsContent value="today" className="mt-4">
              <DeliveryTable
                rows={today}
                loading={todayLoading}
                errorMessage={todayError?.message}
                showCreatedAt
                {...tableProps}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <DeliveryTable
                rows={active}
                loading={activeLoading}
                errorMessage={activeError?.message}
                {...tableProps}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <form onSubmit={submitCancel}>
            <DialogHeader>
              <DialogTitle>Cancel delivery</DialogTitle>
              <DialogDescription>
                Permanently cancels this delivery and refunds the carrier hold if assigned.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Cancelled by admin"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCancelOpen(false)}>
                Back
              </Button>
              <Button type="submit" variant="destructive" disabled={cancelling}>
                {cancelling ? "Cancelling..." : "Cancel delivery"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <form onSubmit={submitStatus}>
            <DialogHeader>
              <DialogTitle>Change status</DialogTitle>
              <DialogDescription>
                Force status for {selected?._id?.slice(-8)}. Use cancel action for Cancelled.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label>New status</Label>
              <Select value={nextStatus} onValueChange={setNextStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStatusOpen(false)}>
                Back
              </Button>
              <Button type="submit" disabled={changing}>
                {changing ? "Updating..." : "Update status"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
