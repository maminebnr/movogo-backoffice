"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client/react";
import { GET_TODAY_DELIVERIES, GET_ACTIVE_DELIVERIES } from "@/lib/graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadgeProps } from "@/lib/badge-utils";

export default function DeliveriesPage() {
  const { data: todayData, loading: todayLoading, error: todayError } = useQuery(GET_TODAY_DELIVERIES);
  const { data: activeData, loading: activeLoading, error: activeError } = useQuery(GET_ACTIVE_DELIVERIES);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliveries</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Today Deliveries</TabsTrigger>
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4">
            {todayLoading && (
              <div className="text-center py-8 text-zinc-500">Loading...</div>
            )}
            {todayError && (
              <div className="text-center py-8 text-red-500">
                Error: {todayError.message}
              </div>
            )}
            {!todayLoading && !todayError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayData && typeof todayData === 'object' && 'todaysDeliveries' in todayData && Array.isArray((todayData as any).todaysDeliveries) && (todayData as any).todaysDeliveries.length > 0 ? (
                    ((todayData as any).todaysDeliveries as any[]).map((delivery: any) => (
                      <TableRow key={delivery._id}>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeProps(delivery.status).variant}
                            className={getStatusBadgeProps(delivery.status).className}
                          >
                            {delivery.status || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>{delivery.senderName || delivery.senderId || "—"}</TableCell>
                        <TableCell>{delivery.carrierName || delivery.carrierId || "—"}</TableCell>
                        <TableCell>
                          {delivery.createdAt
                            ? new Date(delivery.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-zinc-500">
                        No deliveries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            {activeLoading && (
              <div className="text-center py-8 text-zinc-500">Loading...</div>
            )}
            {activeError && (
              <div className="text-center py-8 text-red-500">
                Error: {activeError.message}
              </div>
            )}
            {!activeLoading && !activeError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Carrier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeData && typeof activeData === 'object' && 'availableDeliveries' in activeData && Array.isArray((activeData as any).availableDeliveries) && (activeData as any).availableDeliveries.length > 0 ? (
                    ((activeData as any).availableDeliveries as any[]).map((delivery: any) => (
                      <TableRow key={delivery._id}>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeProps(delivery.status).variant}
                            className={getStatusBadgeProps(delivery.status).className}
                          >
                            {delivery.status || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>{delivery.senderName || delivery.senderId || "—"}</TableCell>
                        <TableCell>{delivery.carrierName || delivery.carrierId || "—"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-zinc-500">
                        No active deliveries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
