"use client";

import React from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconUser,
  IconPalette,
  IconBell,
  IconAlertTriangle,
  IconCheck,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
  IconCopy,
  IconMail,
  IconBrandSlack,
  IconWebhook,
} from "@tabler/icons-react";
import { toast } from "sonner";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const { userId } = useAuth();
  const { theme, setTheme } = useTheme();

  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [slackNotifs, setSlackNotifs] = React.useState(false);
  const [webhookNotifs, setWebhookNotifs] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const themes = [
    { value: "light", label: "Light", icon: IconSun },
    { value: "dark", label: "Dark", icon: IconMoon },
    { value: "system", label: "System", icon: IconDeviceDesktop },
  ];

  const copyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      toast.success("User ID copied to clipboard");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 lg:px-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences and configurations
          </p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconUser className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Avatar"
                    className="size-16 rounded-full border-2 border-border"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {user?.firstName?.[0] || "U"}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-semibold">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "—"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    User ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={userId || "—"}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyUserId}
                      className="shrink-0"
                    >
                      <IconCopy className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Member Since
                  </Label>
                  <p className="text-sm">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>

        {/* Appearance Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconPalette className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>
                  Choose how Sensory looks for you
                </CardDescription>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-accent ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <Icon
                        className={`size-6 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}
                      >
                        {t.label}
                      </span>
                      {isActive && (
                        <Badge
                          variant="secondary"
                          className="mt-1 px-2 py-0 text-[10px]"
                        >
                          <IconCheck className="mr-1 size-3" />
                          Active
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardHeader>
          </Card>
        </section>

        {/* Notification Preferences Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconBell className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Alert Channels</CardTitle>
              <CardDescription>
                Configure how you receive alerts when errors occur
              </CardDescription>
            </CardHeader>
            <div className="space-y-0 px-6 pb-6">
              {/* Email */}
              <div className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <IconMail className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Receive error alerts via email
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={emailNotifs}
                  onChange={setEmailNotifs}
                />
              </div>

              {/* Slack */}
              <div className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10">
                    <IconBrandSlack className="size-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Slack Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Send alerts to a Slack channel
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={slackNotifs}
                  onChange={setSlackNotifs}
                />
              </div>

              {/* Webhook */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <IconWebhook className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Webhook Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      POST alerts to a custom webhook URL
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={webhookNotifs}
                  onChange={setWebhookNotifs}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
          </div>
          <Card className="border-red-500/30">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-base">Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </CardDescription>
              </div>
              <Dialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <IconAlertTriangle className="size-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <IconAlertTriangle className="size-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This will
                      permanently remove all your projects, logs, and settings.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        toast.error(
                          "Account deletion is not available in this demo",
                        );
                        setDeleteConfirmOpen(false);
                      }}
                    >
                      Yes, Delete My Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
