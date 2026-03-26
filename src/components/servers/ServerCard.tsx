import Icon from "@/components/ui/icon";
import { Server } from "./types";

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

export default function ServerCard({
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
