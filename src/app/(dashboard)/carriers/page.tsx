"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_CARRIERS } from "@/lib/graphql/queries";
import {
  ADD_FUNDS,
  DEDUCT_FUNDS,
  SET_CARRIER_STATUS,
  UPDATE_CARRIER_PHONE,
} from "@/lib/graphql/mutations";
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
import { Ban, CheckCircle, History, MinusCircle, Pencil, Wallet } from "lucide-react";
import { toast } from "sonner";

type WalletEntry = {
  deliveryId?: string;
  amount: number;
  remainingBalance: number;
  type: string;
  dateOperation: string;
};

type CarrierRow = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  walletBalance?: number;
  totalEarnings?: number;
  status?: string;
  walletHistory?: WalletEntry[];
};

export default function CarriersPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_CARRIERS);
  const [fundsOpen, setFundsOpen] = useState(false);
  const [deductOpen, setDeductOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selected, setSelected] = useState<CarrierRow | null>(null);
  const [amount, setAmount] = useState("50");
  const [deductAmount, setDeductAmount] = useState("10");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [addFunds, { loading: funding }] = useMutation(ADD_FUNDS, {
    onCompleted: (res: any) => {
      toast.success(`Funds added. New balance: ${res.addFunds.walletBalance.toFixed(2)} TND`);
      setFundsOpen(false);
      setAmount("50");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to add funds"),
  });

  const [deductFunds, { loading: deducting }] = useMutation(DEDUCT_FUNDS, {
    onCompleted: (res: any) => {
      toast.success(`Funds deducted. New balance: ${res.deductFunds.walletBalance.toFixed(2)} TND`);
      setDeductOpen(false);
      setDeductAmount("10");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to deduct funds"),
  });

  const [setStatus, { loading: statusLoading }] = useMutation(SET_CARRIER_STATUS, {
    onCompleted: (res: any) => {
      toast.success(`Carrier status set to ${res.setCarrierStatus.status}`);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update status"),
  });

  const [updatePhone, { loading: updatingPhone }] = useMutation(UPDATE_CARRIER_PHONE, {
    onCompleted: () => {
      toast.success("Phone number updated");
      setPhoneOpen(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update phone number"),
  });

  const carriers: CarrierRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getAllCarriers)
      ? ((data as any).getAllCarriers as CarrierRow[])
      : [];

  const openFunds = (carrier: CarrierRow) => {
    setSelected(carrier);
    setAmount("50");
    setFundsOpen(true);
  };

  const openDeduct = (carrier: CarrierRow) => {
    setSelected(carrier);
    setDeductAmount("10");
    setDeductOpen(true);
  };

  const openPhone = (carrier: CarrierRow) => {
    setSelected(carrier);
    setPhoneNumber(carrier.phoneNumber || "");
    setPhoneOpen(true);
  };

  const openHistory = (carrier: CarrierRow) => {
    setSelected(carrier);
    setHistoryOpen(true);
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

  const submitDeduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(deductAmount);
    if (!selected?.email || !Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid positive amount");
      return;
    }
    await deductFunds({ variables: { input: { email: selected.email, amount: value } } });
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.email || !phoneNumber.trim()) {
      toast.error("Enter a valid phone number");
      return;
    }
    await updatePhone({ variables: { email: selected.email, phoneNumber: phoneNumber.trim() } });
  };

  const toggleStatus = async (carrier: CarrierRow) => {
    const next = carrier.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    await setStatus({ variables: { email: carrier.email, status: next } });
  };

  const walletHistory = [...(selected?.walletHistory || [])].sort(
    (a, b) => new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime(),
  );

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
                  <TableHead>Phone</TableHead>
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
                      <TableCell>{carrier.phoneNumber || "—"}</TableCell>
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
                        <div className="flex items-center justify-end gap-1">
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
                            className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600"
                            title="Deduct funds"
                            onClick={() => openDeduct(carrier)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-zinc-100"
                            title="Wallet history"
                            onClick={() => openHistory(carrier)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit phone"
                            onClick={() => openPhone(carrier)}
                          >
                            <Pencil className="h-4 w-4" />
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
                    <TableCell colSpan={7} className="text-center text-zinc-500">
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

      <Dialog open={deductOpen} onOpenChange={setDeductOpen}>
        <DialogContent>
          <form onSubmit={submitDeduct}>
            <DialogHeader>
              <DialogTitle>Deduct funds</DialogTitle>
              <DialogDescription>
                Debit wallet for {selected?.email || "carrier"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="deduct-amount">Amount (TND)</Label>
              <Input
                id="deduct-amount"
                type="number"
                min="0.1"
                step="0.1"
                value={deductAmount}
                onChange={(e) => setDeductAmount(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeductOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={deducting}>
                {deducting ? "Deducting..." : "Deduct funds"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent>
          <form onSubmit={submitPhone}>
            <DialogHeader>
              <DialogTitle>Edit phone number</DialogTitle>
              <DialogDescription>{selected?.email}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+216 XX XXX XXX"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPhoneOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatingPhone}>
                {updatingPhone ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Wallet history</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletHistory.length > 0 ? (
                  walletHistory.map((entry, idx) => (
                    <TableRow key={`${entry.deliveryId || "entry"}-${idx}`}>
                      <TableCell className="whitespace-nowrap">
                        {entry.dateOperation
                          ? new Date(entry.dateOperation).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell
                        className={entry.amount < 0 ? "text-red-600" : "text-green-600"}
                      >
                        {entry.amount >= 0 ? "+" : ""}
                        {entry.amount.toFixed(2)} TND
                      </TableCell>
                      <TableCell>{entry.remainingBalance.toFixed(2)} TND</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500">
                      No wallet history
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
