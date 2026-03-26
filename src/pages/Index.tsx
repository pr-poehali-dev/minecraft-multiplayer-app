import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { Server, Tab, INITIAL_SERVERS } from "@/components/servers/types";
import ServerCard from "@/components/servers/ServerCard";
import AddServerModal from "@/components/servers/AddServerModal";

export default function Index() {
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);
  const [newServer, setNewServer] = useState({ name: "", host: "", port: "19132" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = tab === "favorites" ? servers.filter((s) => s.favorite) : servers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.host.toLowerCase().includes(q) ||
          s.tag?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [servers, tab, search]);

  const toggleFavorite = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    );
  };

  const handleConnect = (server: Server) => {
    if (!server.online) return;
    setConnecting(server.id);
    const addr = `${server.host}:${server.port}`;
    navigator.clipboard.writeText(addr).catch(() => {});
    setTimeout(() => {
      setConnecting(null);
      setConnected(server.id);
      setTimeout(() => setConnected(null), 3000);
    }, 1200);
  };

  const copyAddress = (server: Server) => {
    const addr = `${server.host}:${server.port}`;
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopiedId(server.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addServer = () => {
    if (!newServer.name.trim() || !newServer.host.trim()) return;
    const s: Server = {
      id: Date.now().toString(),
      name: newServer.name,
      host: newServer.host,
      port: parseInt(newServer.port) || 19132,
      description: "Добавлен вручную",
      version: "1.21",
      online: false,
      players: 0,
      maxPlayers: 100,
      favorite: false,
      tag: "Свой",
    };
    setServers((prev) => [...prev, s]);
    setNewServer({ name: "", host: "", port: "19132" });
    setAddOpen(false);
  };

  const removeServer = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
  };

  const onlineCount = servers.filter((s) => s.online).length;
  const favCount = servers.filter((s) => s.favorite).length;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-mono font-bold">MC</span>
            </div>
            <span className="font-mono font-semibold text-foreground tracking-tight">
              MCPEHub
            </span>
            <span className="text-muted-foreground font-mono text-xs hidden sm:block">
              / серверы
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary px-2.5 py-1 rounded">
              <span className="status-dot status-dot-online"></span>
              <span className="text-primary">{onlineCount}</span>
              <span className="hidden sm:inline">онлайн</span>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-mono font-medium px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
            >
              <Icon name="Plus" size={13} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Всего серверов", value: servers.length, icon: "Server", accent: false },
            { label: "В сети сейчас", value: onlineCount, icon: "Wifi", accent: true },
            { label: "Избранных", value: favCount, icon: "Star", accent: false },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded p-3 sm:px-4 sm:py-3 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] sm:text-xs font-mono mb-1">
                <Icon name={stat.icon} size={11} />
                <span className="hidden sm:inline">{stat.label}</span>
              </div>
              <div
                className={`text-xl sm:text-2xl font-mono font-semibold ${
                  stat.accent ? "text-primary glow-green-text" : "text-foreground"
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex bg-secondary rounded p-0.5 gap-0.5 self-start">
            {(["all", "favorites"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "Все серверы" : `Избранные (${favCount})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, адресу, тегу..."
              className="w-full bg-secondary border border-border rounded pl-8 pr-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Server list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-mono text-sm">
              <Icon name="ServerOff" size={32} className="mx-auto mb-3 opacity-30" />
              Серверов не найдено
            </div>
          )}
          {filtered.map((server, i) => (
            <ServerCard
              key={server.id}
              server={server}
              index={i}
              connecting={connecting === server.id}
              connected={connected === server.id}
              copied={copiedId === server.id}
              onConnect={() => handleConnect(server)}
              onFavorite={() => toggleFavorite(server.id)}
              onCopy={() => copyAddress(server)}
              onRemove={() => removeServer(server.id)}
            />
          ))}
        </div>
      </main>

      {addOpen && (
        <AddServerModal
          newServer={newServer}
          onChange={setNewServer}
          onAdd={addServer}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
