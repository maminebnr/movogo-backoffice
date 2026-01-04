"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_ACCOUNTS } from "@/lib/graphql/queries";
import { VERIFY_ACCOUNT } from "@/lib/graphql/mutations";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeProps } from "@/lib/badge-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AccountsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ACCOUNTS);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [verifyAccount, { loading: verifying }] = useMutation(VERIFY_ACCOUNT, {
    onCompleted: () => {
      toast.success("Account verified successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify account");
    },
  });


  const handleEdit = (account: any) => {
    setSelectedAccount(account);
    setEditForm({
      firstName: account.firstName || "",
      lastName: account.lastName || "",
      email: account.email || "",
      role: account.role || "",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (account: any) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const handleVerify = (account: any) => {
    // Note: verifyAccount requires email and code, so this is a placeholder
    // In a real implementation, you'd need to get the verification code
    toast.info("Verification requires email and code. Please implement verification code input.");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: UpdateAccount mutation may not exist in the API
    // This is a placeholder for future implementation
    toast.info("Update account functionality will be implemented when the API mutation is available.");
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    // Note: DeleteAccount mutation may not exist in the API
    // This is a placeholder for future implementation
    toast.info("Delete account functionality will be implemented when the API mutation is available.");
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8 text-zinc-500">Loading...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">
              Error: {error.message}
            </div>
          )}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && typeof data === 'object' && 'getAllAccounts' in data && Array.isArray((data as any).getAllAccounts) && (data as any).getAllAccounts.length > 0 ? (
                  ((data as any).getAllAccounts as any[]).map((account: any) => (
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => handleEdit(account)}
                            title="Edit account"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleVerify(account)}
                            disabled={verifying}
                            title="Verify account"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(account)}
                            title="Delete account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500">
                      No accounts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Update the account information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CARRIER">Carrier</SelectItem>
                    <SelectItem value="SENDER">Sender</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account
              {selectedAccount && (
                <span className="font-semibold">
                  {" "}
                  {selectedAccount.firstName} {selectedAccount.lastName} ({selectedAccount.email})
                </span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
