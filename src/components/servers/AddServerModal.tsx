import Icon from "@/components/ui/icon";

interface NewServerForm {
  name: string;
  host: string;
  port: string;
}

interface AddServerModalProps {
  newServer: NewServerForm;
  onChange: (value: NewServerForm) => void;
  onAdd: () => void;
  onClose: () => void;
}

export default function AddServerModal({
  newServer,
  onChange,
  onAdd,
  onClose,
}: AddServerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
            onClick={onClose}
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
              onChange={(e) => onChange({ ...newServer, name: e.target.value })}
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
                onChange={(e) => onChange({ ...newServer, host: e.target.value })}
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
                onChange={(e) => onChange({ ...newServer, port: e.target.value })}
                placeholder="19132"
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 bg-secondary text-secondary-foreground text-sm font-mono py-2 rounded hover:bg-muted transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onAdd}
            disabled={!newServer.name.trim() || !newServer.host.trim()}
            className="flex-1 bg-primary text-primary-foreground text-sm font-mono py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Добавить сервер
          </button>
        </div>
      </div>
    </div>
  );
}
