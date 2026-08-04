import { cn } from "@/lib/utils";

/**
 * Get badge variant and className based on status value
 */
export function getStatusBadgeProps(status: string | null | undefined) {
  if (!status) return { variant: "outline" as const, className: "" };

  const normalizedStatus = status.toUpperCase().trim();

  if (normalizedStatus === "ACTIVE") {
    return {
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600 text-white border-green-600",
    };
  }
  if (
    normalizedStatus === "INACTIVE" ||
    normalizedStatus === "SUSPENDED" ||
    normalizedStatus === "BLOCKED"
  ) {
    return {
      variant: "secondary" as const,
      className: "bg-red-500 hover:bg-red-600 text-white border-red-600",
    };
  }
  if (normalizedStatus === "PENDING") {
    return {
      variant: "outline" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600",
    };
  }

  // Delivery statuses (Movogo enum)
  if (
    normalizedStatus === "PACKAGEDELIVERED" ||
    normalizedStatus === "COMPLETED" ||
    normalizedStatus === "DELIVERED"
  ) {
    return {
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600 text-white border-green-600",
    };
  }
  if (
    normalizedStatus === "ONTHEWAYTOPICKUP" ||
    normalizedStatus === "ARRIVEDATPICKUP" ||
    normalizedStatus === "ONTHEWAYTODROPOFF" ||
    normalizedStatus === "ARRIVEDATDROPOFF" ||
    normalizedStatus === "CARRIERASSIGNED" ||
    normalizedStatus === "IN_PROGRESS" ||
    normalizedStatus === "IN TRANSIT" ||
    normalizedStatus === "PICKED_UP"
  ) {
    return {
      variant: "outline" as const,
      className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    };
  }
  if (
    normalizedStatus === "ORDERCONFIRMED" ||
    normalizedStatus === "WAITING"
  ) {
    return {
      variant: "outline" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600",
    };
  }
  if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    return {
      variant: "secondary" as const,
      className: "bg-red-500 hover:bg-red-600 text-white border-red-600",
    };
  }
  if (normalizedStatus === "FAILED" || normalizedStatus === "REJECTED") {
    return {
      variant: "destructive" as const,
      className: "",
    };
  }

  // Default
  return { variant: "outline" as const, className: "" };
}

/**
 * Get badge variant and className based on role value
 */
export function getRoleBadgeProps(role: string | null | undefined) {
  if (!role) return { variant: "outline" as const, className: "" };

  const normalizedRole = role.toUpperCase().trim();

  if (normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN") {
    return {
      variant: "default" as const,
      className: "bg-purple-500 hover:bg-purple-600 text-white border-purple-600",
    };
  }
  if (normalizedRole === "CARRIER") {
    return {
      variant: "outline" as const,
      className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    };
  }
  if (normalizedRole === "SENDER") {
    return {
      variant: "outline" as const,
      className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-600",
    };
  }
  if (normalizedRole === "USER") {
    return {
      variant: "secondary" as const,
      className: "",
    };
  }

  // Default
  return { variant: "outline" as const, className: "" };
}

