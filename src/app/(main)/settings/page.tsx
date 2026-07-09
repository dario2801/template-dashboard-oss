"use client"

import { siteConfig } from "@/app/siteConfig"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { useSessionIdentity } from "@/lib/useSessionIdentity"
import { cx, focusRing } from "@/lib/utils"
import { useState } from "react"

const workspaceInitials = siteConfig.name
  .split(" ")
  .map((word) => word[0])
  .join("")

const notificationSettings = [
  {
    id: "weekly-summary",
    label: "Weekly summary email",
    description: "A digest of your workspace activity every Monday.",
    defaultChecked: true,
  },
  {
    id: "usage-alerts",
    label: "Usage alerts",
    description: "Get notified when a metric approaches its limit.",
    defaultChecked: true,
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "News about new Nova Analytics features and changes.",
    defaultChecked: false,
  },
]

function NotificationToggle({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string
  label: string
  description: string
  defaultChecked: boolean
}) {
  const [enabled, setEnabled] = useState(defaultChecked)
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="pr-4">
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => setEnabled((prev) => !prev)}
        className={cx(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
          enabled
            ? "bg-brand-600 dark:bg-brand-500"
            : "bg-gray-300 dark:bg-gray-700",
          focusRing,
        )}
      >
        <span
          className={cx(
            "inline-block size-4 transform rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const { isLoaded, name, email, initials } = useSessionIdentity()
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Settings
      </h1>
      <div className="mt-4 divide-y divide-gray-200 sm:mt-6 lg:mt-8 dark:divide-gray-800">
        <section
          aria-labelledby="profile-heading"
          className="grid grid-cols-1 gap-x-14 gap-y-6 pb-10 md:grid-cols-3"
        >
          <div>
            <h2
              id="profile-heading"
              className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-500">
              How your account appears across Nova Analytics.
            </p>
          </div>
          <div className="md:col-span-2">
            {isLoaded ? (
              <>
                <div className="flex items-center gap-4">
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="full-name">Full name</Label>
                    {/* Controlled, because an uncontrolled defaultValue would keep
                        the empty string it mounted with before Clerk resolved. */}
                    <Input
                      id="full-name"
                      name="full-name"
                      value={name}
                      readOnly
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      readOnly
                      className="mt-2"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div
                className="h-14 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"
                aria-hidden="true"
              />
            )}
          </div>
        </section>

        <section
          aria-labelledby="notifications-heading"
          className="grid grid-cols-1 gap-x-14 gap-y-6 py-10 md:grid-cols-3"
        >
          <div>
            <h2
              id="notifications-heading"
              className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
            >
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-500">
              Choose what Nova Analytics can email you about.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {notificationSettings.map((setting) => (
                <NotificationToggle key={setting.id} {...setting} />
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="workspace-heading"
          className="grid grid-cols-1 gap-x-14 gap-y-6 py-10 md:grid-cols-3"
        >
          <div>
            <h2
              id="workspace-heading"
              className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
            >
              Workspace
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-500">
              The workspace this dashboard belongs to.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <span
                className="flex aspect-square size-10 items-center justify-center rounded bg-brand-600 text-xs font-medium text-white dark:bg-brand-500"
                aria-hidden="true"
              >
                {workspaceInitials}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Member plan
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="support-heading"
          className="grid grid-cols-1 gap-x-14 gap-y-6 py-10 md:grid-cols-3"
        >
          <div>
            <h2
              id="support-heading"
              className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
            >
              Support
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-500">
              Questions about your account or billing.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reach the Nova Analytics team at{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {siteConfig.supportEmail}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
