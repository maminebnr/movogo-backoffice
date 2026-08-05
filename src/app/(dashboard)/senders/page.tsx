"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_SENDERS } from "@/lib/graphql/queries";
import { UPDATE_SENDER_PHONE } from "@/lib/graphql/mutations";
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
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type SenderRow = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
};

export default function SendersPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_SENDERS);

  const senders: SenderRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getAllSenders)
      ? ((data as any).getAllSenders as SenderRow[])
      : [];

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [selected, setSelected] = useState<SenderRow | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [updatePhone, { loading: updatingPhone }] = useMutation(UPDATE_SENDER_PHONE, {
    onCompleted: () => {
      toast.success("Phone number updated");
      setPhoneOpen(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update phone number"),
  });

  const openPhone = (sender: SenderRow) => {
    setSelected(sender);
    setPhoneNumber(sender.phoneNumber || "");
    setPhoneOpen(true);
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.email || !phoneNumber.trim()) {
      toast.error("Enter a valid phone number");
      return;
    }
    await updatePhone({ variables: { email: selected.email, phoneNumber: phoneNumber.trim() } });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Senders</CardTitle>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {senders.length > 0 ? (
                  senders.map((sender) => (
                    <TableRow key={sender._id}>
                      <TableCell className="font-medium">
                        {sender.firstName && sender.lastName
                          ? `${sender.firstName} ${sender.lastName}`
                          : sender.firstName || sender.lastName || "—"}
                      </TableCell>
                      <TableCell>{sender.email}</TableCell>
                      <TableCell>{sender.phoneNumber || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit phone"
                          onClick={() => openPhone(sender)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500">
                      No senders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
    </>
  );
}
