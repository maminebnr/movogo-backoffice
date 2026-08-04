"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_ACCOUNTS } from "@/lib/graphql/queries";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeProps } from "@/lib/badge-utils";
import { Input } from "@/components/ui/input";

export default function AccountsPage() {
  const { data, loading, error } = useQuery(GET_ALL_ACCOUNTS, {
    variables: { pagination: { skip: 0, limit: 500 } },
  });

  const accounts =
    data && typeof data === "object" && Array.isArray((data as any).getAllAccounts)
      ? ((data as any).getAllAccounts as any[])
      : [];

  const [search, setSearch] = useState("");
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>Accounts ({filtered.length}/{accounts.length})</CardTitle>
        <Input
          className="max-w-xs"
          placeholder="Search email, name, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
  );
}
