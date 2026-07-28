export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 p-10 font-sans">
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Concer TIX — Admin Dashboard</h1>
      <p className="text-sm text-zinc-500 mb-10">Platform management for events, users, orders, and wristbands.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Events", desc: "Create and manage concert events." },
          { title: "Users", desc: "View and manage registered users." },
          { title: "Orders", desc: "Track ticket and wristband orders." },
          { title: "Wristbands", desc: "Monitor wristband print requests." },
          { title: "Reports", desc: "Sales and analytics reports." },
          { title: "Settings", desc: "Platform configuration and settings." },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-zinc-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-1">{item.title}</h2>
            <p className="text-xs text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
