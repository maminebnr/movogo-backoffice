"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMutation } from "@apollo/client/react";
import { ADMIN_BROADCAST } from "@/lib/graphql/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All users" },
  { value: "SENDER", label: "Senders" },
  { value: "CARRIER", label: "Carriers" },
] as const;

export default function BroadcastPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [role, setRole] = useState<string>("ALL");

  const [broadcast, { loading }] = useMutation(ADMIN_BROADCAST, {
    onCompleted: (res: any) => {
      toast.success(
        `Notification sent to ${res.adminBroadcastNotification.rolesTargeted} recipient group(s)`,
      );
      setTitle("");
      setBody("");
      setRole("ALL");
    },
    onError: (err) => toast.error(err.message || "Failed to send broadcast"),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    await broadcast({
      variables: {
        input: {
          title: title.trim(),
          body: body.trim(),
          role: role === "ALL" ? undefined : role,
        },
      },
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Broadcast notification</CardTitle>
        <CardDescription>
          Send a push notification to all users, or target senders/carriers only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Scheduled maintenance"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notification message shown to recipients"
              rows={4}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Recipients</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Megaphone className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send broadcast"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
