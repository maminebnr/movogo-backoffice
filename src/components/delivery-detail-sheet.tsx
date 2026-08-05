"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_DELIVERY, GET_MESSAGES } from "@/lib/graphql/queries";
import {
  ADMIN_ASSIGN_CARRIER,
  ADMIN_CANCEL_DELIVERY,
  ADMIN_CHANGE_DELIVERY_STATUS,
  ADMIN_UNASSIGN_CARRIER,
  ADMIN_UPDATE_DELIVERY_META,
  SEND_MESSAGE,
} from "@/lib/graphql/mutations";
import { getStatusBadgeProps } from "@/lib/badge-utils";
import { Ban, Eye, EyeOff, Send, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "OrderConfirmed",
  "CarrierAssigned",
  "OnTheWayToPickup",
  "ArrivedAtPickup",
  "OnTheWayToDropoff",
  "ArrivedAtDropoff",
  "PackageDelivered",
] as const;

type Address = {
  street?: string;
  city?: string;
  lat?: number;
  lng?: number;
};

type Contact = {
  name?: string;
  phoneNumber?: string;
};

type DeliveryDetail = {
  _id: string;
  status?: string;
  senderId?: string;
  senderName?: string;
  carrierId?: string;
  carrierName?: string;
  carrierPhone?: string;
  totalPrice?: number;
  distanceKm?: number;
  deliveryOption?: string;
  paymentMethod?: string;
  promoCode?: string;
  discountAmount?: number;
  scheduledFor?: string;
  visibleToCarriers?: boolean;
  cancelReason?: string;
  cancelledBy?: string;
  pickupAddress?: Address;
  deliveryAddress?: Address;
  pickupContact?: Contact;
  contactInfo?: Contact;
  lastLocationCarrier?: { longitude?: number; latitude?: number };
  createdAt?: string;
  updatedAt?: string;
};

type MessageRow = {
  _id: string;
  content?: string;
  senderId?: string;
  senderRole?: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt?: string;
};

function addressLabel(address?: Address) {
  if (!address) return "—";
  const parts = [address.street, address.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function DeliveryDetailSheet({
  deliveryId,
  open,
  onOpenChange,
  onUpdated,
}: {
  deliveryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}) {
  const shouldFetch = open && !!deliveryId;

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_DELIVERY, {
    variables: { _id: deliveryId || "" },
    skip: !shouldFetch,
  });

  const {
    data: messagesData,
    refetch: refetchMessages,
  } = useQuery(GET_MESSAGES, {
    variables: { deliveryId: deliveryId || "" },
    skip: !shouldFetch,
    pollInterval: shouldFetch ? 5000 : 0,
  });

  const delivery: DeliveryDetail | null =
    data && typeof data === "object" && (data as any).delivery ? (data as any).delivery : null;

  const messages: MessageRow[] =
    messagesData && typeof messagesData === "object" && Array.isArray((messagesData as any).getMessages)
      ? ((messagesData as any).getMessages as MessageRow[])
      : [];

  const [nextStatus, setNextStatus] = useState<string>("OrderConfirmed");
  const [cancelReason, setCancelReason] = useState("");
  const [carrierEmail, setCarrierEmail] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    if (delivery?.status && delivery.status !== "Cancelled") {
      setNextStatus(delivery.status);
    }
  }, [delivery?.status]);

  useEffect(() => {
    if (!open) {
      setCancelReason("");
      setCarrierEmail("");
      setChatMessage("");
    }
  }, [open]);

  const notifyUpdated = () => {
    onUpdated?.();
  };

  const [changeStatus, { loading: changingStatus }] = useMutation(ADMIN_CHANGE_DELIVERY_STATUS, {
    onCompleted: (res: any) => {
      toast.success(`Status set to ${res.adminChangeDeliveryStatus.status}`);
      refetch();
      notifyUpdated();
    },
    onError: (err) => toast.error(err.message || "Status update failed"),
  });

  const [cancelDelivery, { loading: cancelling }] = useMutation(ADMIN_CANCEL_DELIVERY, {
    onCompleted: () => {
      toast.success("Delivery cancelled");
      setCancelReason("");
      refetch();
      notifyUpdated();
    },
    onError: (err) => toast.error(err.message || "Cancel failed"),
  });

  const [assignCarrier, { loading: assigning }] = useMutation(ADMIN_ASSIGN_CARRIER, {
    onCompleted: () => {
      toast.success("Carrier assigned");
      setCarrierEmail("");
      refetch();
      notifyUpdated();
    },
    onError: (err) => toast.error(err.message || "Assign carrier failed"),
  });

  const [unassignCarrier, { loading: unassigning }] = useMutation(ADMIN_UNASSIGN_CARRIER, {
    onCompleted: () => {
      toast.success("Carrier unassigned");
      refetch();
      notifyUpdated();
    },
    onError: (err) => toast.error(err.message || "Unassign carrier failed"),
  });

  const [updateMeta, { loading: updatingMeta }] = useMutation(ADMIN_UPDATE_DELIVERY_META, {
    onCompleted: (res: any) => {
      toast.success(
        res.adminUpdateDeliveryMeta.visibleToCarriers
          ? "Delivery is now visible to carriers"
          : "Delivery hidden from carriers",
      );
      refetch();
      notifyUpdated();
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setChatMessage("");
      refetchMessages();
    },
    onError: (err) => toast.error(err.message || "Failed to send message"),
  });

  const terminal = delivery?.status === "PackageDelivered" || delivery?.status === "Cancelled";
  const badge = getStatusBadgeProps(delivery?.status);

  const submitStatus = async () => {
    if (!delivery) return;
    await changeStatus({
      variables: { input: { deliveryId: delivery._id, status: nextStatus } },
    });
  };

  const submitCancel = async () => {
    if (!delivery) return;
    await cancelDelivery({
      variables: {
        input: { deliveryId: delivery._id, cancelReason: cancelReason || undefined },
      },
    });
  };

  const submitAssign = async () => {
    if (!delivery) return;
    if (!carrierEmail.trim()) {
      toast.error("Enter a carrier email");
      return;
    }
    await assignCarrier({
      variables: {
        input: { deliveryId: delivery._id, carrierEmail: carrierEmail.trim() },
      },
    });
  };

  const submitUnassign = async () => {
    if (!delivery) return;
    await unassignCarrier({ variables: { deliveryId: delivery._id } });
  };

  const toggleVisibility = async () => {
    if (!delivery) return;
    await updateMeta({
      variables: {
        input: { deliveryId: delivery._id, visibleToCarriers: !delivery.visibleToCarriers },
      },
    });
  };

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivery || !chatMessage.trim()) return;
    await sendMessage({
      variables: { input: { deliveryId: delivery._id, content: chatMessage.trim() } },
    });
  };

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
      ),
    [messages],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Delivery {delivery?._id ? `#${delivery._id.slice(-8)}` : ""}</SheetTitle>
          <SheetDescription>
            {delivery && (
              <Badge variant={badge.variant} className={badge.className}>
                {delivery.status || "—"}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 flex-1 overflow-y-auto">
          {!deliveryId && <div className="text-center py-8 text-zinc-500">No delivery selected</div>}
          {shouldFetch && loading && (
            <div className="text-center py-8 text-zinc-500">Loading...</div>
          )}
          {shouldFetch && error && (
            <div className="text-center py-8 text-red-500">Error: {error.message}</div>
          )}

          {delivery && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  Chat ({messages.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Addresses</h3>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-zinc-500">Pickup: </span>
                      {addressLabel(delivery.pickupAddress)}
                    </div>
                    <div>
                      <span className="text-zinc-500">Dropoff: </span>
                      {addressLabel(delivery.deliveryAddress)}
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Contacts</h3>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-zinc-500">Sender: </span>
                      {delivery.senderName || delivery.senderId || "—"}
                    </div>
                    <div>
                      <span className="text-zinc-500">Pickup contact: </span>
                      {delivery.pickupContact?.name || "—"}
                      {delivery.pickupContact?.phoneNumber
                        ? ` (${delivery.pickupContact.phoneNumber})`
                        : ""}
                    </div>
                    <div>
                      <span className="text-zinc-500">Dropoff contact: </span>
                      {delivery.contactInfo?.name || "—"}
                      {delivery.contactInfo?.phoneNumber
                        ? ` (${delivery.contactInfo.phoneNumber})`
                        : ""}
                    </div>
                    <div>
                      <span className="text-zinc-500">Carrier: </span>
                      {delivery.carrierName || delivery.carrierId || "Unassigned"}
                      {delivery.carrierPhone ? ` (${delivery.carrierPhone})` : ""}
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Price</h3>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-zinc-500">Total: </span>
                      {typeof delivery.totalPrice === "number"
                        ? `${delivery.totalPrice.toFixed(2)} TND`
                        : "—"}
                    </div>
                    <div>
                      <span className="text-zinc-500">Distance: </span>
                      {typeof delivery.distanceKm === "number"
                        ? `${delivery.distanceKm.toFixed(1)} km`
                        : "—"}
                    </div>
                    <div>
                      <span className="text-zinc-500">Option: </span>
                      {delivery.deliveryOption || "—"}
                    </div>
                    <div>
                      <span className="text-zinc-500">Payment: </span>
                      {delivery.paymentMethod || "—"}
                    </div>
                    {delivery.promoCode && (
                      <div>
                        <span className="text-zinc-500">Promo: </span>
                        {delivery.promoCode}
                        {typeof delivery.discountAmount === "number"
                          ? ` (-${delivery.discountAmount.toFixed(2)} TND)`
                          : ""}
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Schedule &amp; visibility</h3>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-zinc-500">Scheduled for: </span>
                      {delivery.scheduledFor
                        ? new Date(delivery.scheduledFor).toLocaleString()
                        : "Immediate"}
                    </div>
                    <div>
                      <span className="text-zinc-500">Created: </span>
                      {delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : "—"}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-zinc-500">Visible to carriers:</span>
                      <Badge variant={delivery.visibleToCarriers ? "default" : "secondary"}>
                        {delivery.visibleToCarriers ? "Yes" : "No"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingMeta || terminal}
                        onClick={toggleVisibility}
                      >
                        {delivery.visibleToCarriers ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        {delivery.visibleToCarriers ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                </section>

                {delivery.lastLocationCarrier && (
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-900">Carrier location</h3>
                    <div className="text-sm text-zinc-600">
                      {delivery.lastLocationCarrier.latitude?.toFixed(5)},{" "}
                      {delivery.lastLocationCarrier.longitude?.toFixed(5)}
                    </div>
                  </section>
                )}

                {delivery.status === "Cancelled" && (
                  <section className="space-y-1 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <div className="font-semibold">Cancelled</div>
                    {delivery.cancelledBy && <div>By: {delivery.cancelledBy}</div>}
                    {delivery.cancelReason && <div>Reason: {delivery.cancelReason}</div>}
                  </section>
                )}

                <section className="space-y-2 border-t pt-4">
                  <h3 className="text-sm font-semibold text-zinc-900">Change status</h3>
                  <div className="flex items-center gap-2">
                    <Select value={nextStatus} onValueChange={setNextStatus} disabled={terminal}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      disabled={terminal || changingStatus}
                      onClick={submitStatus}
                    >
                      {changingStatus ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Carrier assignment</h3>
                  {delivery.carrierId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600"
                      disabled={unassigning || terminal}
                      onClick={submitUnassign}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                      {unassigning ? "Unassigning..." : "Unassign carrier"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="carrier@email.com"
                        value={carrierEmail}
                        onChange={(e) => setCarrierEmail(e.target.value)}
                        className="flex-1"
                        disabled={terminal}
                      />
                      <Button size="sm" disabled={assigning || terminal} onClick={submitAssign}>
                        <UserPlus className="h-3.5 w-3.5" />
                        {assigning ? "Assigning..." : "Assign"}
                      </Button>
                    </div>
                  )}
                </section>

                <section className="space-y-2 border-t pt-4">
                  <h3 className="text-sm font-semibold text-red-700">Cancel delivery</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Reason (optional)"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="flex-1"
                      disabled={terminal}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={cancelling || terminal}
                      onClick={submitCancel}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {cancelling ? "Cancelling..." : "Cancel"}
                    </Button>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <div className="flex flex-col gap-3">
                  <div className="max-h-80 overflow-y-auto rounded-md border p-3 space-y-3 bg-zinc-50">
                    {sortedMessages.length > 0 ? (
                      sortedMessages.map((message) => (
                        <div key={message._id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {message.senderRole || "User"}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {message.createdAt
                                ? new Date(message.createdAt).toLocaleTimeString()
                                : ""}
                            </span>
                          </div>
                          {message.content && <div className="text-zinc-700">{message.content}</div>}
                          {message.mediaUrl && (
                            <a
                              href={message.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View attachment
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-sm text-zinc-500 py-4">
                        No messages yet
                      </div>
                    )}
                  </div>
                  <form onSubmit={submitMessage} className="flex flex-col gap-2">
                    <Textarea
                      placeholder="Type a message as admin..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" size="sm" disabled={sending || !chatMessage.trim()}>
                      <Send className="h-3.5 w-3.5" />
                      {sending ? "Sending..." : "Send"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
