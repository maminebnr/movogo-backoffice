"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_CARRIERS } from "@/lib/graphql/queries";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeProps } from "@/lib/badge-utils";

export default function CarriersPage() {
  const { data, loading, error } = useQuery(GET_ALL_CARRIERS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carriers</CardTitle>
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
                <TableHead>Status</TableHead>
                <TableHead>Wallet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.getAllCarriers?.length > 0 ? (
                data.getAllCarriers.map((carrier: any) => (
                  <TableRow key={carrier._id}>
                    <TableCell className="font-medium">
                      {carrier.firstName && carrier.lastName 
                        ? `${carrier.firstName} ${carrier.lastName}` 
                        : carrier.firstName || carrier.lastName || "—"}
                    </TableCell>
                    <TableCell>{carrier.email}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeProps(carrier.status).variant}
                        className={getStatusBadgeProps(carrier.status).className}
                      >
                        {carrier.status || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>{carrier.walletBalance ? `${carrier.walletBalance.toFixed(2)} TND` : "0.00 TND"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500">
                    No carriers found
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
