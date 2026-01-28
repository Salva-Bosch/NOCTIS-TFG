/* DATOS ORBITALES REALES DE LOS ASTROS */
export const ORBITS = {
    sun: {
        radius_km: 696340,
        distance_km: 0,
        period_days: 0
    },

    mercury: {
        radius_km: 2439.7,
        distance_km: 57_909_227,
        period_days: 87.97
    },

    venus: {
        radius_km: 6051.8,
        distance_km: 108_209_475,
        period_days: 224.7
    },

    earth: {
        radius_km: 6371,
        distance_km: 149_597_870,
        period_days: 365.25
    },

    mars: {
        radius_km: 3389.5,
        distance_km: 227_943_824,
        period_days: 686.98
    },

    jupiter: {
        radius_km: 69_911,
        distance_km: 778_340_821,
        period_days: 4332.59
    },

    saturn: {
        radius_km: 58_232,
        distance_km: 1_426_666_422,
        period_days: 10_759
    },

    uranus: {
        radius_km: 25_362,
        distance_km: 2_870_658_186,
        period_days: 30_688.5
    },

    neptune: {
        radius_km: 24_622,
        distance_km: 4_498_396_441,
        period_days: 60_182
    },

    // === LUNAS ===
    moon: {
        radius_km: 1737.4,
        distance_km: 384_400,
        period_days: 27.32,
        parent: "earth"
    },

    phobos: {
        radius_km: 11.3,
        distance_km: 9_378,
        period_days: 0.32,
        parent: "mars"
    },

    deimos: {
        radius_km: 6.2,
        distance_km: 23_460,
        period_days: 1.26,
        parent: "mars"
    },

    // Júpiter (galileanas)
    io: {
        radius_km: 1821.6,
        distance_km: 421_700,
        period_days: 1.77,
        parent: "jupiter"
    },

    europa: {
        radius_km: 1560.8,
        distance_km: 671_034,
        period_days: 3.55,
        parent: "jupiter"
    },

    ganymede: {
        radius_km: 2634.1,
        distance_km: 1_070_412,
        period_days: 7.15,
        parent: "jupiter"
    },

    callisto: {
        radius_km: 2410.3,
        distance_km: 1_882_709,
        period_days: 16.69,
        parent: "jupiter"
    },

    // Saturno (principales)
    titan: {
        radius_km: 2574.7,
        distance_km: 1_221_870,
        period_days: 15.95,
        parent: "saturn"
    },

    enceladus: {
        radius_km: 252.1,
        distance_km: 238_020,
        period_days: 1.37,
        parent: "saturn"
    },

    // Urano
    titania: {
        radius_km: 788.9,
        distance_km: 435_910,
        period_days: 8.71,
        parent: "uranus"
    },

    oberon: {
        radius_km: 761.4,
        distance_km: 583_520,
        period_days: 13.46,
        parent: "uranus"
    },

    // Neptuno
    triton: {
        radius_km: 1353.4,
        distance_km: 354_759,
        period_days: 5.88,
        parent: "neptune"
    },

    // Plutón
    charon: {
        radius_km: 606,
        distance_km: 19_640,
        period_days: 6.39,
        parent: "pluto"
    },

    // === PLANETAS ENANOS ===
    pluto: {
        radius_km: 1188.3,
        distance_km: 5_906_380_000,
        period_days: 90_560
    },

    eris: {
        radius_km: 1163,
        distance_km: 10_120_000_000,
        period_days: 203_600
    },

    ceres: {
        radius_km: 473,
        distance_km: 413_700_000,
        period_days: 1680
    }
};
