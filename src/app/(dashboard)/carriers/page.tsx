"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_CARRIERS } from "@/lib/graphql/queries";
import { ADD_FUNDS, SET_CARRIER_STATUS } from "@/lib/graphql/mutations";
import { Badge } from "@/components/ui/badge";
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
import { Ban, CheckCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function CarriersPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_CARRIERS);
  const [fundsOpen, setFundsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("50");

  const [addFunds, { loading: funding }] = useMutation(ADD_FUNDS, {
    onCompleted: (res: any) => {
      toast.success(`Funds added. New balance: ${res.addFunds.walletBalance.toFixed(2)} TND`);
      setFundsOpen(false);
      setAmount("50");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to add funds"),
  });

  const [setStatus, { loading: statusLoading }] = useMutation(SET_CARRIER_STATUS, {
    onCompleted: (res: any) => {
      toast.success(`Carrier status set to ${res.setCarrierStatus.status}`);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update status"),
  });

  const carriers =
    data && typeof data === "object" && "getAllCarriers" in data && Array.isArray((data as any).getAllCarriers)
      ? ((data as any).getAllCarriers as any[])
      : [];

  const openFunds = (carrier: any) => {
    setSelected(carrier);
    setFundsOpen(true);
  };

  const submitFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!selected?.email || !Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid positive amount");
      return;
    }
    await addFunds({ variables: { input: { email: selected.email, amount: value } } });
  };

  const toggleStatus = async (carrier: any) => {
    const next = carrier.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    await setStatus({ variables: { email: carrier.email, status: next } });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Carriers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8 text-zinc-500">Loading...</div>}
          {error && <div className="text-center py-8 text-red-500">Error: {error.message}</div>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carriers.length > 0 ? (
                  carriers.map((carrier) => (
                    <TableRow key={carrier._id}>
                      <TableCell className="font-medium">
                        {carrier.firstName && carrier.lastName
                          ? `${carrier.firstName} ${carrier.lastName}`
                          : carrier.firstName || carrier.lastName || "—"}
                      </TableCell>
                      <TableCell>{carrier.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeProps(carrier.status).variant}
                          className={getStatusBadgeProps(carrier.status).className}
                        >
                          {carrier.status || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {typeof carrier.walletBalance === "number"
                          ? `${carrier.walletBalance.toFixed(2)} TND`
                          : "0.00 TND"}
                      </TableCell>
                      <TableCell>
                        {typeof carrier.totalEarnings === "number"
                          ? `${carrier.totalEarnings.toFixed(2)} TND`
                          : "0.00 TND"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600"
                            title="Add funds"
                            onClick={() => openFunds(carrier)}
                          >
                            <Wallet className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              carrier.status === "BLOCKED"
                                ? "hover:bg-green-50 hover:text-green-600"
                                : "hover:bg-red-50 hover:text-red-600"
                            }`}
                            title={carrier.status === "BLOCKED" ? "Unblock carrier" : "Block carrier"}
                            disabled={statusLoading}
                            onClick={() => toggleStatus(carrier)}
                          >
                            {carrier.status === "BLOCKED" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500">
                      No carriers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={fundsOpen} onOpenChange={setFundsOpen}>
        <DialogContent>
          <form onSubmit={submitFunds}>
            <DialogHeader>
              <DialogTitle>Add funds</DialogTitle>
              <DialogDescription>
                Credit wallet for {selected?.email || "carrier"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="amount">Amount (TND)</Label>
              <Input
                id="amount"
                type="number"
                min="0.1"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFundsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={funding}>
                {funding ? "Adding..." : "Add funds"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
