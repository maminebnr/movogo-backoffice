"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_SENDERS } from "@/lib/graphql/queries";

export default function SendersPage() {
  const { data, loading, error } = useQuery(GET_ALL_SENDERS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senders</CardTitle>
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
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && typeof data === 'object' && 'getAllSenders' in data && Array.isArray((data as any).getAllSenders) && (data as any).getAllSenders.length > 0 ? (
                ((data as any).getAllSenders as any[]).map((sender: any) => (
                  <TableRow key={sender._id}>
                    <TableCell className="font-medium">
                      {sender.firstName && sender.lastName 
                        ? `${sender.firstName} ${sender.lastName}` 
                        : sender.firstName || sender.lastName || "—"}
                    </TableCell>
                    <TableCell>{sender.email}</TableCell>
                    <TableCell>{sender.phoneNumber || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-zinc-500">
                    No senders found
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
