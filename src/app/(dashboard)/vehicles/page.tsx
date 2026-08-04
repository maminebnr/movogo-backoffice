"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_VEHICLE_TYPE } from "@/lib/graphql/mutations";
import { GET_VEHICLE_TYPES } from "@/lib/graphql/queries";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconURL, setIconURL] = useState("");
  const [priceMultiplier, setPriceMultiplier] = useState("1");
  const [open, setOpen] = useState(false);
  const { data, loading: queryLoading, refetch } = useQuery(GET_VEHICLE_TYPES);
  const [addVehicleType, { loading }] = useMutation(ADD_VEHICLE_TYPE, {
    refetchQueries: [GET_VEHICLE_TYPES],
    onCompleted: () => {
      toast.success("Vehicle type added successfully!");
      setOpen(false);
      setName("");
      setDescription("");
      setIconURL("");
      setPriceMultiplier("1");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add vehicle type");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please fill in the vehicle name");
      return;
    }
    const multiplier = Number(priceMultiplier);
    await addVehicleType({
      variables: {
        input: {
          name,
          description: description || null,
          iconURL: iconURL || null,
          priceMultiplier: Number.isFinite(multiplier) && multiplier >= 0.1 ? multiplier : 1,
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicles</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Vehicle Type</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Vehicle Type</DialogTitle>
                <DialogDescription>
                  Add a new vehicle type to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Van, Truck, Motorcycle"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Large capacity vehicle"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="iconURL">Icon URL (Optional)</Label>
                  <Input
                    id="iconURL"
                    value={iconURL}
                    onChange={(e) => setIconURL(e.target.value)}
                    placeholder="e.g., https://example.com/icon.png"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priceMultiplier">Price multiplier</Label>
                  <Input
                    id="priceMultiplier"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={priceMultiplier}
                    onChange={(e) => setPriceMultiplier(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Vehicle Type"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {queryLoading && (
          <div className="text-center py-8 text-zinc-500">Loading...</div>
        )}
        {!queryLoading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Icon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && typeof data === 'object' && 'getVehicleTypes' in data && Array.isArray((data as any).getVehicleTypes) && (data as any).getVehicleTypes.length > 0 ? (
                ((data as any).getVehicleTypes as any[]).map((vehicle: any) => (
                  <TableRow key={vehicle._id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.description || "—"}</TableCell>
                    <TableCell>
                      {typeof vehicle.priceMultiplier === "number"
                        ? `x${vehicle.priceMultiplier}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {vehicle.iconURL ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={vehicle.iconURL}
                            alt={vehicle.name}
                            width={32}
                            height={32}
                            className="rounded object-contain"
                            unoptimized
                          />
                          <a 
                            href={vehicle.iconURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </a>
                        </div>
                      ) : (
                        vehicle.iconName || "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-zinc-500 text-center">
                    No vehicle types found. Add one to get started.
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
