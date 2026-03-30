/* ASTROS DEL SISTEMA SOLAR */
export const ASTROS = [
    // ESTRELLA
    { id: "sun", name: "Sol", nameEn: "Sun", type: "star", parent: null, order: 0 },

    // PLANETAS
    { id: "mercury", name: "Mercurio", nameEn: "Mercury", type: "planet", parent: "sun", order: 1 },
    { id: "venus", name: "Venus", nameEn: "Venus", type: "planet", parent: "sun", order: 2 },
    { id: "earth", name: "Tierra", nameEn: "Earth", type: "planet", parent: "sun", order: 3 },
    { id: "mars", name: "Marte", nameEn: "Mars", type: "planet", parent: "sun", order: 4 },
    { id: "jupiter", name: "Júpiter", nameEn: "Jupiter", type: "planet", parent: "sun", order: 5 },
    { id: "saturn", name: "Saturno", nameEn: "Saturn", type: "planet", parent: "sun", order: 6 },
    { id: "uranus", name: "Urano", nameEn: "Uranus", type: "planet", parent: "sun", order: 7 },
    { id: "neptune", name: "Neptuno", nameEn: "Neptune", type: "planet", parent: "sun", order: 8 },

    // LUNAS
    // Tierra
    { id: "moon", name: "Luna", nameEn: "Moon", type: "moon", parent: "earth", order: 1 },

    // Marte
    { id: "phobos", name: "Fobos", nameEn: "Phobos", type: "moon", parent: "mars", order: 1 },
    { id: "deimos", name: "Deimos", nameEn: "Deimos", type: "moon", parent: "mars", order: 2 },

    // Júpiter (galileanas)
    { id: "io", name: "Ío", nameEn: "Io", type: "moon", parent: "jupiter", order: 1 },
    { id: "europa", name: "Europa", nameEn: "Europa", type: "moon", parent: "jupiter", order: 2 },
    { id: "ganymede", name: "Ganímedes", nameEn: "Ganymede", type: "moon", parent: "jupiter", order: 3 },
    { id: "callisto", name: "Calisto", nameEn: "Callisto", type: "moon", parent: "jupiter", order: 4 },

    // Saturno (principales)
    { id: "titan", name: "Titán", nameEn: "Titan", type: "moon", parent: "saturn", order: 1 },
    { id: "enceladus", name: "Encélado", nameEn: "Enceladus", type: "moon", parent: "saturn", order: 2 },
    { id: "rhea", name: "Rea", nameEn: "Rhea", type: "moon", parent: "saturn", order: 3 },
    { id: "iapetus", name: "Jápeto", nameEn: "Iapetus", type: "moon", parent: "saturn", order: 4 },

    // Urano (principales)
    { id: "titania", name: "Titania", nameEn: "Titania", type: "moon", parent: "uranus", order: 1 },
    { id: "oberon", name: "Oberón", nameEn: "Oberon", type: "moon", parent: "uranus", order: 2 },

    // Neptuno
    { id: "triton", name: "Tritón", nameEn: "Triton", type: "moon", parent: "neptune", order: 1 },

    // 🛰️ ASTROS EXTRA
    { id: "pluto", name: "Plutón", nameEn: "Pluto", type: "dwarf_planet", parent: "sun", order: 9 },
    { id: "charon", name: "Caronte", nameEn: "Charon", type: "moon", parent: "pluto", order: 1 },

    { id: "eris", name: "Eris", nameEn: "Eris", type: "dwarf_planet", parent: "sun", order: 10 },

    // Cinturón de asteroides
    { id: "ceres", name: "Ceres", nameEn: "Ceres", type: "dwarf_planet", parent: "sun", order: 5.5 },
];
