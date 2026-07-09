import { Badge } from "@/components/Badge"
import { roles, users } from "@/data/data"

const roleLabel = (value: string) =>
  roles.find((role) => role.value === value)?.label ?? value

export default function Details() {
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Details
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
        {users.length} members have access to this workspace.
      </p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Member
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => (
              <tr key={user.email}>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                      aria-hidden="true"
                    >
                      {user.initials}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge variant={user.role === "admin" ? "default" : "neutral"}>
                    {roleLabel(user.role)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
