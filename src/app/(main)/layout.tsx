import { Sidebar } from "@/components/ui/navigation/sidebar"
import { auth } from "@clerk/nextjs/server"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await auth.protect()

  return (
    <div className="mx-auto max-w-screen-2xl">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="relative">
          <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
