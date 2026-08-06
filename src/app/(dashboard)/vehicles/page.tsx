"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ADD_VEHICLE_TYPE,
  DELETE_VEHICLE_TYPE,
  UPDATE_VEHICLE_TYPE,
} from "@/lib/graphql/mutations";
import { GET_VEHICLE_TYPES } from "@/lib/graphql/queries";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type VehicleRow = {
  _id: string;
  name: string;
  description?: string;
  iconName?: string;
  iconURL?: string;
  priceMultiplier?: number;
};

export default function VehiclesPage() {
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    iconURL: "",
    priceMultiplier: "1",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    iconURL: "",
    priceMultiplier: "1",
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<VehicleRow | null>(null);

  const { data, loading: queryLoading, refetch } = useQuery(GET_VEHICLE_TYPES);

  const vehicles: VehicleRow[] =
    data && typeof data === "object" && Array.isArray((data as any).getVehicleTypes)
      ? ((data as any).getVehicleTypes as VehicleRow[])
      : [];

  const [addVehicleType, { loading }] = useMutation(ADD_VEHICLE_TYPE, {
    refetchQueries: [GET_VEHICLE_TYPES],
    onCompleted: () => {
      toast.success("Vehicle type added");
      setOpen(false);
      setCreateForm({ name: "", description: "", iconURL: "", priceMultiplier: "1" });
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to add vehicle type"),
  });

  const [updateVehicleType, { loading: updating }] = useMutation(UPDATE_VEHICLE_TYPE, {
    onCompleted: () => {
      toast.success("Vehicle type updated");
      setEditOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to update"),
  });

  const [deleteVehicleType, { loading: deleting }] = useMutation(DELETE_VEHICLE_TYPE, {
    onCompleted: () => {
      toast.success("Vehicle type deleted");
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to delete"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) {
      toast.error("Please fill in the vehicle name");
      return;
    }
    const multiplier = Number(createForm.priceMultiplier);
    await addVehicleType({
      variables: {
        input: {
          name: createForm.name,
          description: createForm.description || null,
          iconURL: createForm.iconURL || null,
          priceMultiplier: Number.isFinite(multiplier) && multiplier >= 0.1 ? multiplier : 1,
        },
      },
    });
  };

  const openEdit = (vehicle: VehicleRow) => {
    setSelected(vehicle);
    setEditForm({
      name: vehicle.name,
      description: vehicle.description || "",
      iconURL: vehicle.iconURL || "",
      priceMultiplier:
        typeof vehicle.priceMultiplier === "number" ? String(vehicle.priceMultiplier) : "1",
    });
    setEditOpen(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const multiplier = Number(editForm.priceMultiplier);
    await updateVehicleType({
      variables: {
        input: {
          id: selected._id,
          name: editForm.name,
          description: editForm.description || null,
          iconURL: editForm.iconURL || null,
          priceMultiplier: Number.isFinite(multiplier) && multiplier >= 0.1 ? multiplier : 1,
        },
      },
    });
  };

  const handleDelete = async (vehicle: VehicleRow) => {
    if (!window.confirm(`Delete vehicle type "${vehicle.name}"?`)) return;
    await deleteVehicleType({ variables: { id: vehicle._id } });
  };

  const renderFormFields = (
    form: typeof createForm,
    setForm: React.Dispatch<React.SetStateAction<typeof createForm>>,
    idPrefix: string,
  ) => (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-name`}>Vehicle Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g., Van, Truck, Motorcycle"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-description`}>Description (Optional)</Label>
        <Input
          id={`${idPrefix}-description`}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="e.g., Large capacity vehicle"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-iconURL`}>Icon URL (Optional)</Label>
        <Input
          id={`${idPrefix}-iconURL`}
          value={form.iconURL}
          onChange={(e) => setForm((f) => ({ ...f, iconURL: e.target.value }))}
          placeholder="e.g., https://example.com/icon.png"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-priceMultiplier`}>Price multiplier</Label>
        <Input
          id={`${idPrefix}-priceMultiplier`}
          type="number"
          min="0.1"
          step="0.1"
          value={form.priceMultiplier}
          onChange={(e) => setForm((f) => ({ ...f, priceMultiplier: e.target.value }))}
          placeholder="1"
        />
      </div>
    </>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicles</CardTitle>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (v) {
              setCreateForm({ name: "", description: "", iconURL: "", priceMultiplier: "1" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Vehicle Type</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Vehicle Type</DialogTitle>
                <DialogDescription>Add a new vehicle type to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {renderFormFields(createForm, setCreateForm, "create")}
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
        {queryLoading && <div className="text-center py-8 text-zinc-500">Loading...</div>}
        {!queryLoading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                          onClick={() => openEdit(vehicle)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                          disabled={deleting}
                          onClick={() => handleDelete(vehicle)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-zinc-500 text-center">
                    No vehicle types found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={submitEdit}>
            <DialogHeader>
              <DialogTitle>Edit vehicle type</DialogTitle>
              <DialogDescription>{selected?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {renderFormFields(editForm, setEditForm, "edit")}
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
    </Card>
  );
}
