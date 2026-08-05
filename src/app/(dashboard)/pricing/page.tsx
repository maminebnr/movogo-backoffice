"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_PRICING_SETTINGS } from "@/lib/graphql/queries";
import { UPDATE_PRICING_SETTINGS } from "@/lib/graphql/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type PricingForm = {
  carrierGain: string;
  appGain: string;
  minInWallet: string;
  minAbsolute: string;
  initialFare: string;
  initialFareExpress: string;
  kmPrice: string;
  expressKmPrice: string;
};

const emptyForm: PricingForm = {
  carrierGain: "",
  appGain: "",
  minInWallet: "",
  minAbsolute: "",
  initialFare: "",
  initialFareExpress: "",
  kmPrice: "",
  expressKmPrice: "",
};

const FIELDS: { key: keyof PricingForm; label: string; suffix?: string }[] = [
  { key: "carrierGain", label: "Carrier gain share", suffix: "(0-1)" },
  { key: "appGain", label: "App gain share", suffix: "(0-1)" },
  { key: "minInWallet", label: "Minimum in wallet", suffix: "(TND)" },
  { key: "minAbsolute", label: "Minimum absolute fare", suffix: "(TND)" },
  { key: "initialFare", label: "Initial fare (standard)", suffix: "(TND)" },
  { key: "initialFareExpress", label: "Initial fare (express)", suffix: "(TND)" },
  { key: "kmPrice", label: "Price per km (standard)", suffix: "(TND)" },
  { key: "expressKmPrice", label: "Price per km (express)", suffix: "(TND)" },
];

export default function PricingPage() {
  const { data, loading, error, refetch } = useQuery(GET_PRICING_SETTINGS);
  const [form, setForm] = useState<PricingForm>(emptyForm);

  useEffect(() => {
    const settings =
      data && typeof data === "object" && (data as any).getPricingSettings
        ? (data as any).getPricingSettings
        : null;
    if (settings) {
      setForm({
        carrierGain: String(settings.carrierGain ?? ""),
        appGain: String(settings.appGain ?? ""),
        minInWallet: String(settings.minInWallet ?? ""),
        minAbsolute: String(settings.minAbsolute ?? ""),
        initialFare: String(settings.initialFare ?? ""),
        initialFareExpress: String(settings.initialFareExpress ?? ""),
        kmPrice: String(settings.kmPrice ?? ""),
        expressKmPrice: String(settings.expressKmPrice ?? ""),
      });
    }
  }, [data]);

  const [updateSettings, { loading: saving }] = useMutation(UPDATE_PRICING_SETTINGS, {
    onCompleted: () => {
      toast.success("Pricing settings saved");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to save settings"),
  });

  const carrierGainNum = Number(form.carrierGain);
  const appGainNum = Number(form.appGain);
  const gainSum = carrierGainNum + appGainNum;
  const gainsValid =
    Number.isFinite(carrierGainNum) &&
    Number.isFinite(appGainNum) &&
    Math.abs(gainSum - 1) < 0.001;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const values: Record<string, number> = {};
    for (const { key } of FIELDS) {
      const num = Number(form[key]);
      if (!Number.isFinite(num) || num < 0) {
        toast.error(`Enter a valid value for ${FIELDS.find((f) => f.key === key)?.label}`);
        return;
      }
      values[key] = num;
    }

    if (Math.abs(values.carrierGain + values.appGain - 1) > 0.001) {
      toast.error("Carrier gain + app gain must equal 1");
      return;
    }

    await updateSettings({ variables: { input: values } });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Pricing settings</CardTitle>
        <CardDescription>
          Configure how delivery fares are calculated and split between the app and carriers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center py-8 text-zinc-500">Loading...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error.message}</div>}
        {!loading && !error && (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(({ key, label, suffix }) => (
                <div className="grid gap-2" key={key}>
                  <Label htmlFor={key}>
                    {label} {suffix && <span className="text-zinc-400">{suffix}</span>}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    step={key === "carrierGain" || key === "appGain" ? "0.01" : "0.1"}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    required
                  />
                </div>
              ))}
            </div>

            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                gainsValid
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              Carrier gain + app gain = {Number.isFinite(gainSum) ? gainSum.toFixed(2) : "—"}
              {!gainsValid && " (must equal 1.00)"}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || !gainsValid}>
                {saving ? "Saving..." : "Save settings"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
