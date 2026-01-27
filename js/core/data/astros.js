/* ASTROS DEL SISTEMA SOLAR */
export const ASTROS = [
    // ESTRELLA
    { id: "sun", name: "Sol", type: "star", parent: null, order: 0 },

    // PLANETAS
    { id: "mercury", name: "Mercurio", type: "planet", parent: "sun", order: 1 },
    { id: "venus", name: "Venus", type: "planet", parent: "sun", order: 2 },
    { id: "earth", name: "Tierra", type: "planet", parent: "sun", order: 3 },
    { id: "mars", name: "Marte", type: "planet", parent: "sun", order: 4 },
    { id: "jupiter", name: "Júpiter", type: "planet", parent: "sun", order: 5 },
    { id: "saturn", name: "Saturno", type: "planet", parent: "sun", order: 6 },
    { id: "uranus", name: "Urano", type: "planet", parent: "sun", order: 7 },
    { id: "neptune", name: "Neptuno", type: "planet", parent: "sun", order: 8 },

    // LUNAS
    // Tierra
    { id: "moon", name: "Luna", type: "moon", parent: "earth", order: 1 },

    // Marte
    { id: "phobos", name: "Fobos", type: "moon", parent: "mars", order: 1 },
    { id: "deimos", name: "Deimos", type: "moon", parent: "mars", order: 2 },

    // Júpiter (galileanas)
    { id: "io", name: "Ío", type: "moon", parent: "jupiter", order: 1 },
    { id: "europa", name: "Europa", type: "moon", parent: "jupiter", order: 2 },
    { id: "ganymede", name: "Ganímedes", type: "moon", parent: "jupiter", order: 3 },
    { id: "callisto", name: "Calisto", type: "moon", parent: "jupiter", order: 4 },

    // Saturno (principales)
    { id: "titan", name: "Titán", type: "moon", parent: "saturn", order: 1 },
    { id: "enceladus", name: "Encélado", type: "moon", parent: "saturn", order: 2 },
    { id: "rhea", name: "Rea", type: "moon", parent: "saturn", order: 3 },
    { id: "iapetus", name: "Jápeto", type: "moon", parent: "saturn", order: 4 },

    // Urano (principales)
    { id: "titania", name: "Titania", type: "moon", parent: "uranus", order: 1 },
    { id: "oberon", name: "Oberón", type: "moon", parent: "uranus", order: 2 },

    // Neptuno
    { id: "triton", name: "Tritón", type: "moon", parent: "neptune", order: 1 },

    // 🛰️ ASTROS EXTRA
    { id: "pluto", name: "Plutón", type: "dwarf_planet", parent: "sun", order: 9 },
    { id: "charon", name: "Caronte", type: "moon", parent: "pluto", order: 1 },

    { id: "eris", name: "Eris", type: "dwarf_planet", parent: "sun", order: 10 },

    // Cinturón de asteroides
    { id: "ceres", name: "Ceres", type: "dwarf_planet", parent: "sun", order: 5.5 },
];
