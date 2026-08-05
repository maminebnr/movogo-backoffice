"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_PROMO_CODES } from "@/lib/graphql/queries";
import {
  CREATE_PROMO_CODE,
  DELETE_PROMO_CODE,
  SET_PROMO_ACTIVE,
  UPDATE_PROMO_CODE,
} from "@/lib/graphql/mutations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ban, CheckCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DISCOUNT_TYPES = ["PERCENT", "FIXED"] as const;

type PromoRow = {
  _id: string;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  message: string;
  active: boolean;
};

type PromoForm = {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
  message: string;
  active: boolean;
};

const emptyForm: PromoForm = {
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  message: "",
  active: true,
};

export default function PromosPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PROMO_CODES);

  const promos: PromoRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getAllPromoCodes)
      ? ((data as any).getAllPromoCodes as PromoRow[])
      : [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<PromoRow | null>(null);
  const [createForm, setCreateForm] = useState<PromoForm>(emptyForm);
  const [editForm, setEditForm] = useState<PromoForm>(emptyForm);

  const [createPromo, { loading: creating }] = useMutation(CREATE_PROMO_CODE, {
    onCompleted: () => {
      toast.success("Promo code created");
      setCreateOpen(false);
      setCreateForm(emptyForm);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to create promo code"),
  });

  const [updatePromo, { loading: updating }] = useMutation(UPDATE_PROMO_CODE, {
    onCompleted: () => {
      toast.success("Promo code updated");
      setEditOpen(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update promo code"),
  });

  const [setActive, { loading: togglingActive }] = useMutation(SET_PROMO_ACTIVE, {
    onCompleted: (res: any) => {
      toast.success(`Promo ${res.setPromoCodeActive.active ? "activated" : "deactivated"}`);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update status"),
  });

  const [deletePromo, { loading: deleting }] = useMutation(DELETE_PROMO_CODE, {
    onCompleted: () => {
      toast.success("Promo code deleted");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to delete promo code"),
  });

  const openEdit = (promo: PromoRow) => {
    setSelected(promo);
    setEditForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: String(promo.discountValue),
      message: promo.message,
      active: promo.active,
    });
    setEditOpen(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(createForm.discountValue);
    if (!createForm.code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    await createPromo({
      variables: {
        input: {
          code: createForm.code.trim().toUpperCase(),
          discountType: createForm.discountType,
          discountValue: value,
          message: createForm.message,
          active: createForm.active,
        },
      },
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const value = Number(editForm.discountValue);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    await updatePromo({
      variables: {
        input: {
          id: selected._id,
          code: editForm.code.trim().toUpperCase(),
          discountType: editForm.discountType,
          discountValue: value,
          message: editForm.message,
          active: editForm.active,
        },
      },
    });
  };

  const handleDelete = async (promo: PromoRow) => {
    if (!window.confirm(`Delete promo code "${promo.code}"?`)) return;
    await deletePromo({ variables: { id: promo._id } });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Promo Codes</CardTitle>
          <Dialog
            open={createOpen}
            onOpenChange={(v) => {
              setCreateOpen(v);
              if (v) setCreateForm(emptyForm);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create promo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={submitCreate}>
                <DialogHeader>
                  <DialogTitle>Create promo code</DialogTitle>
                  <DialogDescription>
                    Add a new promo code that senders can apply at checkout.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="c-code">Code</Label>
                    <Input
                      id="c-code"
                      value={createForm.code}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                      }
                      placeholder="e.g., WELCOME10"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Discount type</Label>
                      <Select
                        value={createForm.discountType}
                        onValueChange={(v) =>
                          setCreateForm((f) => ({ ...f, discountType: v as "PERCENT" | "FIXED" }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DISCOUNT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="c-value">
                        Discount value {createForm.discountType === "PERCENT" ? "(%)" : "(TND)"}
                      </Label>
                      <Input
                        id="c-value"
                        type="number"
                        min="0"
                        step="0.1"
                        value={createForm.discountValue}
                        onChange={(e) =>
                          setCreateForm((f) => ({ ...f, discountValue: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea
                      id="c-message"
                      value={createForm.message}
                      onChange={(e) => setCreateForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Shown to the sender when the promo is applied"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="c-active"
                      type="checkbox"
                      className="h-4 w-4 rounded border-input accent-orange-600"
                      checked={createForm.active}
                      onChange={(e) => setCreateForm((f) => ({ ...f, active: e.target.checked }))}
                    />
                    <Label htmlFor="c-active" className="font-normal">
                      Active immediately
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8 text-zinc-500">Loading...</div>}
          {error && <div className="text-center py-8 text-red-500">Error: {error.message}</div>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.length > 0 ? (
                  promos.map((promo) => (
                    <TableRow key={promo._id}>
                      <TableCell className="font-medium">{promo.code}</TableCell>
                      <TableCell>{promo.discountType}</TableCell>
                      <TableCell>
                        {promo.discountType === "PERCENT"
                          ? `${promo.discountValue}%`
                          : `${promo.discountValue.toFixed(2)} TND`}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={promo.message}>
                        {promo.message || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={promo.active ? "default" : "secondary"}
                          className={
                            promo.active
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-zinc-200 text-zinc-700"
                          }
                        >
                          {promo.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              promo.active
                                ? "hover:bg-red-50 hover:text-red-600"
                                : "hover:bg-green-50 hover:text-green-600"
                            }`}
                            title={promo.active ? "Deactivate" : "Activate"}
                            disabled={togglingActive}
                            onClick={() =>
                              setActive({ variables: { id: promo._id, active: !promo.active } })
                            }
                          >
                            {promo.active ? (
                              <Ban className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                            onClick={() => openEdit(promo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                            disabled={deleting}
                            onClick={() => handleDelete(promo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500">
                      No promo codes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={submitEdit}>
            <DialogHeader>
              <DialogTitle>Edit promo code</DialogTitle>
              <DialogDescription>{selected?.code}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="e-code">Code</Label>
                <Input
                  id="e-code"
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount type</Label>
                  <Select
                    value={editForm.discountType}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, discountType: v as "PERCENT" | "FIXED" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISCOUNT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="e-value">
                    Discount value {editForm.discountType === "PERCENT" ? "(%)" : "(TND)"}
                  </Label>
                  <Input
                    id="e-value"
                    type="number"
                    min="0"
                    step="0.1"
                    value={editForm.discountValue}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, discountValue: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-message">Message</Label>
                <Textarea
                  id="e-message"
                  value={editForm.message}
                  onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="e-active"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-orange-600"
                  checked={editForm.active}
                  onChange={(e) => setEditForm((f) => ({ ...f, active: e.target.checked }))}
                />
                <Label htmlFor="e-active" className="font-normal">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
