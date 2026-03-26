import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  description: string;
  version: string;
  online: boolean;
  players: number;
  maxPlayers: number;
  favorite: boolean;
  ping?: number;
  tag?: string;
}

const INITIAL_SERVERS: Server[] = [
  {
    id: "1",
    name: "CubeCraft Games",
    host: "mco.cubecraft.net",
    port: 19132,
    description: "Мини-игры, BedWars, SkyWars",
    version: "1.21",
    online: true,
    players: 8412,
    maxPlayers: 15000,
    favorite: true,
    ping: 42,
    tag: "Мини-игры",
  },
  {
    id: "2",
    name: "Hive Games",
    host: "geo.hivebedrock.network",
    port: 19132,
    description: "SkyWars, Murder Mystery, DeathRun",
    version: "1.21",
    online: true,
    players: 5230,
    maxPlayers: 10000,
    favorite: true,
    ping: 58,
    tag: "PvP",
  },
  {
    id: "3",
    name: "Mineplex",
    host: "pe.mineplex.com",
    port: 19132,
    description: "Классический сервер с огромным выбором режимов",
    version: "1.20",
    online: true,
    players: 1800,
    maxPlayers: 5000,
    favorite: false,
    ping: 120,
    tag: "Классика",
  },
  {
    id: "4",
    name: "Lifeboat Network",
    host: "mco.lbsg.net",
    port: 19132,
    description: "Survival, SkyBlock, Hunger Games",
    version: "1.21",
    online: false,
    players: 0,
    maxPlayers: 8000,
    favorite: false,
    ping: undefined,
    tag: "Выживание",
  },
  {
    id: "5",
    name: "Nether Games",
    host: "play.nethergames.org",
    port: 19132,
    description: "Фракции, Дуэли, Ивенты",
    version: "1.21",
    online: true,
    players: 3100,
    maxPlayers: 6000,
    favorite: false,
    ping: 85,
    tag: "PvP",
  },
];

type Tab = "all" | "favorites";

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

      {/* Add server modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}
        >
          <div className="bg-card border border-border rounded-lg w-full max-w-md mx-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-mono font-semibold text-foreground text-sm">
                  Добавить сервер
                </h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Введите данные вашего сервера
                </p>
              </div>
              <button
                onClick={() => setAddOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1.5">
                  Название
                </label>
                <input
                  value={newServer.name}
                  onChange={(e) => setNewServer((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Мой сервер"
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-mono text-muted-foreground block mb-1.5">
                    Адрес (IP / домен)
                  </label>
                  <input
                    value={newServer.host}
                    onChange={(e) => setNewServer((p) => ({ ...p, host: e.target.value }))}
                    placeholder="play.example.com"
                    className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground block mb-1.5">
                    Порт
                  </label>
                  <input
                    value={newServer.port}
                    onChange={(e) => setNewServer((p) => ({ ...p, port: e.target.value }))}
                    placeholder="19132"
                    className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button
                onClick={() => setAddOpen(false)}
                className="flex-1 bg-secondary text-secondary-foreground text-sm font-mono py-2 rounded hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={addServer}
                disabled={!newServer.name.trim() || !newServer.host.trim()}
                className="flex-1 bg-primary text-primary-foreground text-sm font-mono py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Добавить сервер
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ServerCardProps {
  server: Server;
  index: number;
  connecting: boolean;
  connected: boolean;
  copied: boolean;
  onConnect: () => void;
  onFavorite: () => void;
  onCopy: () => void;
  onRemove: () => void;
}

function ServerCard({
  server,
  index,
  connecting,
  connected,
  copied,
  onConnect,
  onFavorite,
  onCopy,
  onRemove,
}: ServerCardProps) {
  const pingColor =
    !server.ping
      ? "text-muted-foreground"
      : server.ping < 60
      ? "text-primary"
      : server.ping < 120
      ? "text-amber-400"
      : "text-red-400";

  const loadPct = Math.round((server.players / server.maxPlayers) * 100);

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200 animate-fade-in group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Status dot */}
        <div className="flex flex-col items-center gap-2 pt-1.5 flex-shrink-0">
          <div
            className={`status-dot ${
              connecting
                ? "status-dot-loading"
                : server.online
                ? "status-dot-online"
                : "status-dot-offline"
            }`}
          />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono font-semibold text-foreground text-sm leading-none">
              {server.name}
            </span>
            {server.tag && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                {server.tag}
              </span>
            )}
            {server.favorite && (
              <Icon name="Star" size={11} className="text-amber-400 fill-amber-400" />
            )}
            {connected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 animate-fade-in">
                ✓ Адрес скопирован
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-2">
            <span>{server.host}</span>
            <span>:</span>
            <span>{server.port}</span>
          </div>

          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            {server.description}
          </p>

          {server.online && (
            <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
              <div className="flex items-center gap-1.5">
                <Icon name="Users" size={11} className="text-muted-foreground" />
                <span className="text-foreground">{server.players.toLocaleString()}</span>
                <span className="text-muted-foreground">/ {server.maxPlayers.toLocaleString()}</span>
              </div>
              {server.ping && (
                <div className="flex items-center gap-1">
                  <Icon name="Activity" size={11} className="text-muted-foreground" />
                  <span className={pingColor}>{server.ping}ms</span>
                </div>
              )}
              <span className="text-muted-foreground">v{server.version}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      loadPct > 80 ? "bg-red-400" : loadPct > 50 ? "bg-amber-400" : "bg-primary"
                    }`}
                    style={{ width: `${loadPct}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{loadPct}%</span>
              </div>
            </div>
          )}

          {!server.online && (
            <span className="text-xs font-mono text-muted-foreground">Сервер недоступен</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <button
            onClick={onFavorite}
            className={`p-1.5 rounded transition-colors ${
              server.favorite
                ? "text-amber-400 hover:text-amber-300"
                : "text-muted-foreground hover:text-amber-400"
            }`}
            title={server.favorite ? "Убрать из избранного" : "В избранное"}
          >
            <Icon name="Star" size={14} className={server.favorite ? "fill-amber-400" : ""} />
          </button>

          <button
            onClick={onCopy}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Скопировать адрес"
          >
            <Icon
              name={copied ? "Check" : "Copy"}
              size={14}
              className={copied ? "text-primary" : ""}
            />
          </button>

          <button
            onClick={onRemove}
            className="p-1.5 rounded text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Удалить"
          >
            <Icon name="Trash2" size={14} />
          </button>

          <button
            onClick={onConnect}
            disabled={!server.online || connecting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ml-1 ${
              server.online && !connecting
                ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
                : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
            }`}
          >
            {connecting ? (
              <>
                <Icon name="Loader" size={12} className="animate-spin" />
                <span className="hidden sm:inline">Подключение</span>
              </>
            ) : (
              <>
                <Icon name="Zap" size={12} />
                <span className="hidden sm:inline">Войти</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}