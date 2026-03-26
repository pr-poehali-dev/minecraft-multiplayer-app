export interface Server {
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

export type Tab = "all" | "favorites";

export const INITIAL_SERVERS: Server[] = [
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
