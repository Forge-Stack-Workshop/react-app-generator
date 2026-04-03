export const territoriesData = [
  { id: "paris", name: "Paris", coords: [48.8566, 2.3522] },
  { id: "lyon", name: "Lyon", coords: [45.764, 4.8357] },
  { id: "marseille", name: "Marseille", coords: [43.2965, 5.3698] },
  { id: "lille", name: "Lille", coords: [50.6292, 3.0573] },
  { id: "bordeaux", name: "Bordeaux", coords: [44.8378, -0.5792] },
  { id: "toulouse", name: "Toulouse", coords: [43.6047, 1.4442] },
  { id: "nice", name: "Nice", coords: [43.7102, 7.262] },
  { id: "bruxelles", name: "Bruxelles", coords: [50.8503, 4.3517] },
  { id: "amsterdam", name: "Amsterdam", coords: [52.3676, 4.9041] },
  { id: "berlin", name: "Berlin", coords: [52.52, 13.405] },
  { id: "madrid", name: "Madrid", coords: [40.4168, -3.7038] },
];

export const territoryProviders = {
  // ---------------------------------------------------------
  // 1) Paris → Tous les providers = on → TERRITOIRE ONLINE
  // ---------------------------------------------------------
  paris: {
    shuttles: [
      { name: "Navette Lumière", state: "on" },
      { name: "TransMobilis", state: "on" },
    ],
    dispatch: [{ name: "CoordiFleet", state: "on" }],
    security: [{ name: "SafeWatch Paris", state: "on" }],
  },

  // ---------------------------------------------------------
  // 2) Lyon → ≥1 errors → TERRITOIRE ERROR
  // ---------------------------------------------------------
  lyon: {
    shuttles: [{ name: "Rhône Shuttle", state: "on" }],
    dispatch: [
      { name: "LyoDispatch", state: "errors" }, // déclenche errors
    ],
    security: [{ name: "LyonSecure", state: "on" }],
  },

  // ---------------------------------------------------------
  // 3) Marseille → 1 off + 1 unknown → TERRITOIRE UNSTABLE
  // ---------------------------------------------------------
  marseille: {
    shuttles: [{ name: "Blue Coast Shuttle", state: "unknown" }],
    dispatch: [
      { name: "PortoDispatch", state: "off" }, // déclenche unstable
    ],
    security: [{ name: "MarSec", state: "on" }],
  },

  // ---------------------------------------------------------
  // 4) Lille → Tous off → TERRITOIRE OFFLINE
  // ---------------------------------------------------------
  lille: {
    shuttles: [{ name: "NordNavette", state: "off" }],
    dispatch: [],
    security: [{ name: "LilleGuard", state: "off" }],
  },

  // ---------------------------------------------------------
  // 5) Bordeaux → 1 off + 1 unknown → TERRITOIRE UNSTABLE
  // ---------------------------------------------------------
  bordeaux: {
    shuttles: [],
    dispatch: [
      { name: "WineDispatch", state: "off" },
      { name: "GaronneFlow", state: "unknown" },
    ],
    security: [{ name: "BdxSecure", state: "on" }],
  },

  // ---------------------------------------------------------
  // 6) Toulouse → Tous on → TERRITOIRE ONLINE
  // ---------------------------------------------------------
  toulouse: {
    shuttles: [
      { name: "AeroShuttle", state: "on" },
      { name: "OccitanMove", state: "on" },
    ],
    dispatch: [{ name: "ToulDispatch", state: "on" }],
    security: [{ name: "RedBrick Security", state: "on" }],
  },

  // ---------------------------------------------------------
  // 7) Nice → 1 unknown → TERRITOIRE UNSTABLE
  // ---------------------------------------------------------
  nice: {
    shuttles: [{ name: "AzurNavette", state: "on" }],
    dispatch: [{ name: "NiceDispatch", state: "unknown" }],
    security: [{ name: "CôteSafe", state: "on" }],
  },

  // ---------------------------------------------------------
  // 8) Bruxelles → Tous on → TERRITOIRE ONLINE
  // ---------------------------------------------------------
  bruxelles: {
    shuttles: [{ name: "BruxMove", state: "on" }],
    dispatch: [{ name: "DispatchBe", state: "on" }],
    security: [{ name: "BelgSecure", state: "on" }],
  },

  // ---------------------------------------------------------
  // 9) Amsterdam → Tous on → TERRITOIRE ONLINE
  // ---------------------------------------------------------
  amsterdam: {
    shuttles: [{ name: "CanalShuttle", state: "on" }],
    dispatch: [{ name: "AmstelDispatch", state: "on" }],
    security: [{ name: "DutchGuard", state: "on" }],
  },

  // ---------------------------------------------------------
  // 10) Berlin → 1 errors → TERRITOIRE ERROR
  // ---------------------------------------------------------
  berlin: {
    shuttles: [{ name: "MetroShuttle DE", state: "errors" }],
    dispatch: [{ name: "BerlinDispatch", state: "on" }],
    security: [{ name: "BrandenSecure", state: "on" }],
  },

  // ---------------------------------------------------------
  // 11) Madrid → Tous off → TERRITOIRE OFFLINE
  // ---------------------------------------------------------
  madrid: {
    shuttles: [{ name: "Madrid Shuttle", state: "off" }],
    dispatch: [{ name: "CastillaDispatch", state: "off" }],
    security: [{ name: "IberiaSecure", state: "off" }],
  },
};
