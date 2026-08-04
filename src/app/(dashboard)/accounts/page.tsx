"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_ACCOUNTS } from "@/lib/graphql/queries";
import {
  CREATE_ACCOUNT_BY_ADMIN,
  FORCE_VERIFY_ACCOUNT,
  SET_ACCOUNT_DISABLED,
  UPDATE_ACCOUNT_BY_ADMIN,
} from "@/lib/graphql/mutations";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeProps } from "@/lib/badge-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Ban, CheckCircle, Pencil, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["SENDER", "CARRIER", "ADMIN", "SUPER_ADMIN"] as const;

type AccountRow = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  verified?: boolean;
  disabled?: boolean;
};

export default function AccountsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ACCOUNTS, {
    variables: { pagination: { skip: 0, limit: 500 } },
  });

  const accounts: AccountRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getAllAccounts)
      ? ((data as any).getAllAccounts as AccountRow[])
      : [];

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<AccountRow | null>(null);

  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "SENDER",
  });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "SENDER",
  });

  const [forceVerify, { loading: verifying }] = useMutation(FORCE_VERIFY_ACCOUNT, {
    onCompleted: () => {
      toast.success("Account verified");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Verify failed"),
  });

  const [setDisabled, { loading: disabling }] = useMutation(SET_ACCOUNT_DISABLED, {
    onCompleted: (res: any) => {
      toast.success(res.setAccountDisabled.disabled ? "Account disabled" : "Account enabled");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const [updateAccount, { loading: updating }] = useMutation(UPDATE_ACCOUNT_BY_ADMIN, {
    onCompleted: () => {
      toast.success("Account updated");
      setEditOpen(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const [createAccount, { loading: creating }] = useMutation(CREATE_ACCOUNT_BY_ADMIN, {
    onCompleted: () => {
      toast.success("Account created");
      setCreateOpen(false);
      setCreateForm({ email: "", password: "", firstName: "", lastName: "", role: "SENDER" });
      refetch();
    },
    onError: (err) => toast.error(err.message || "Create failed"),
  });

  const filtered = accounts.filter((account) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      account.email?.toLowerCase().includes(q) ||
      account.firstName?.toLowerCase().includes(q) ||
      account.lastName?.toLowerCase().includes(q) ||
      account.role?.toLowerCase().includes(q)
    );
  });

  const openEdit = (account: AccountRow) => {
    setSelected(account);
    setEditForm({
      firstName: account.firstName || "",
      lastName: account.lastName || "",
      email: account.email || "",
      role: account.role || "SENDER",
    });
    setEditOpen(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    await createAccount({ variables: { input: createForm } });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await updateAccount({
      variables: {
        input: {
          accountId: selected._id,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          role: editForm.role,
        },
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle>
            Accounts ({filtered.length}/{accounts.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input
              className="max-w-xs"
              placeholder="Search email, name, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setCreateOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell className="font-medium">
                        {account.firstName && account.lastName
                          ? `${account.firstName} ${account.lastName}`
                          : account.firstName || account.lastName || "—"}
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getRoleBadgeProps(account.role).variant}
                          className={getRoleBadgeProps(account.role).className}
                        >
                          {account.role || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={account.verified ? "default" : "secondary"}
                          className={
                            account.verified
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-zinc-200 text-zinc-700"
                          }
                        >
                          {account.verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={account.disabled ? "destructive" : "secondary"}
                          className={
                            account.disabled
                              ? undefined
                              : "bg-emerald-100 text-emerald-800"
                          }
                        >
                          {account.disabled ? "Disabled" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!account.verified && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-50 hover:text-green-600"
                              title="Force verify"
                              disabled={verifying}
                              onClick={() =>
                                forceVerify({ variables: { accountId: account._id } })
                              }
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                            onClick={() => openEdit(account)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              account.disabled
                                ? "hover:bg-green-50 hover:text-green-600"
                                : "hover:bg-red-50 hover:text-red-600"
                            }`}
                            title={account.disabled ? "Enable account" : "Disable account"}
                            disabled={disabling || account.role === "SUPER_ADMIN"}
                            onClick={() =>
                              setDisabled({
                                variables: {
                                  accountId: account._id,
                                  disabled: !account.disabled,
                                },
                              })
                            }
                          >
                            {account.disabled ? (
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
                      No accounts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form onSubmit={submitCreate}>
            <DialogHeader>
              <DialogTitle>Create account</DialogTitle>
              <DialogDescription>
                Creates a verified account immediately (sender/carrier profile if needed).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <div className="grid gap-2">
                <Label htmlFor="c-first">First name</Label>
                <Input
                  id="c-first"
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-last">Last name</Label>
                <Input
                  id="c-last"
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-pass">Password</Label>
                <Input
                  id="c-pass"
                  type="password"
                  minLength={8}
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                  value={createForm.role}
                  onValueChange={(role) => setCreateForm((f) => ({ ...f, role }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={submitEdit}>
            <DialogHeader>
              <DialogTitle>Edit account</DialogTitle>
              <DialogDescription>{selected?.email}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <div className="grid gap-2">
                <Label htmlFor="e-first">First name</Label>
                <Input
                  id="e-first"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-last">Last name</Label>
                <Input
                  id="e-last"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-email">Email</Label>
                <Input
                  id="e-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(role) => setEditForm((f) => ({ ...f, role }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
