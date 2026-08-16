import { logout } from "@/app/actions";

const navigation = ["Dashboard", "Practice", "Mocks", "Intelligence", "Plan"];
export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div><strong className="text-xl text-emerald-900">SIS</strong><span className="ml-3 hidden text-sm text-slate-500 sm:inline">Student Intelligence System</span></div>
        <form action={logout}><button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">Log out</button></form>
      </div>
    </header>
    <div className="mx-auto max-w-6xl px-5">
      <nav aria-label="Main navigation" className="flex gap-5 overflow-x-auto border-b border-slate-200 py-4 text-sm">
        {navigation.map((item, index) => index === 0
          ? <span key={item} aria-current="page" className="font-semibold text-emerald-800">{item}</span>
          : <span key={item} className="whitespace-nowrap text-slate-400">{item} <span className="text-xs">Coming soon</span></span>)}
      </nav>
      {children}
    </div>
  </div>;
}
