/* DATOS DE CONSTELACIONES — Coordenadas J2000 (RA en horas, Dec en grados) */

export const CONSTELLATIONS = [

    // ======================== ORIÓN ========================
    {
        id: "orion",
        name: "Orión",
        abbr: "Ori",
        stars: [
            { name: "Betelgeuse",  ra: 5.919,  dec:  7.407, mag: 0.42 },  // 0 - α Ori
            { name: "Rigel",       ra: 5.242,  dec: -8.201, mag: 0.13 },  // 1 - β Ori
            { name: "Bellatrix",   ra: 5.419,  dec:  6.350, mag: 1.64 },  // 2 - γ Ori
            { name: "Mintaka",     ra: 5.533,  dec: -0.299, mag: 2.23 },  // 3 - δ Ori
            { name: "Alnilam",     ra: 5.603,  dec: -1.202, mag: 1.69 },  // 4 - ε Ori
            { name: "Alnitak",     ra: 5.679,  dec: -1.943, mag: 1.77 },  // 5 - ζ Ori
            { name: "Saiph",      ra: 5.796,  dec: -9.670, mag: 2.09 },  // 6 - κ Ori
        ],
        lines: [[0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 3], [0, 5]]
    },

    // ======================== OSA MAYOR ========================
    {
        id: "ursa_major",
        name: "Osa Mayor",
        abbr: "UMa",
        stars: [
            { name: "Dubhe",    ra: 11.062, dec: 61.751, mag: 1.79 },  // 0 - α UMa
            { name: "Merak",    ra: 11.031, dec: 56.382, mag: 2.37 },  // 1 - β UMa
            { name: "Phecda",   ra: 11.897, dec: 53.695, mag: 2.44 },  // 2 - γ UMa
            { name: "Megrez",   ra: 12.257, dec: 57.033, mag: 3.31 },  // 3 - δ UMa
            { name: "Alioth",   ra: 12.900, dec: 55.960, mag: 1.77 },  // 4 - ε UMa
            { name: "Mizar",    ra: 13.399, dec: 54.926, mag: 2.27 },  // 5 - ζ UMa
            { name: "Alkaid",   ra: 13.792, dec: 49.313, mag: 1.86 },  // 6 - η UMa
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
    },

    // ======================== OSA MENOR ========================
    {
        id: "ursa_minor",
        name: "Osa Menor",
        abbr: "UMi",
        stars: [
            { name: "Polaris",  ra: 2.530,  dec: 89.264, mag: 1.98 },  // 0 - α UMi
            { name: "Kochab",   ra: 14.845, dec: 74.156, mag: 2.08 },  // 1 - β UMi
            { name: "Pherkad",  ra: 15.346, dec: 71.834, mag: 3.05 },  // 2 - γ UMi
            { name: "Yildun",   ra: 17.537, dec: 86.586, mag: 4.36 },  // 3 - δ UMi
            { name: "ε UMi",    ra: 16.766, dec: 82.037, mag: 4.23 },  // 4
            { name: "ζ UMi",    ra: 15.734, dec: 77.795, mag: 4.32 },  // 5
            { name: "η UMi",    ra: 16.292, dec: 75.755, mag: 4.95 },  // 6
        ],
        lines: [[0, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 2]]
    },

    // ======================== CASIOPEA ========================
    {
        id: "cassiopeia",
        name: "Casiopea",
        abbr: "Cas",
        stars: [
            { name: "Schedar",  ra: 0.675,  dec: 56.537, mag: 2.23 },  // 0 - α Cas
            { name: "Caph",     ra: 0.153,  dec: 59.150, mag: 2.27 },  // 1 - β Cas
            { name: "Tsih",     ra: 0.945,  dec: 60.717, mag: 2.47 },  // 2 - γ Cas
            { name: "Ruchbah",  ra: 1.430,  dec: 60.235, mag: 2.68 },  // 3 - δ Cas
            { name: "Segin",    ra: 1.907,  dec: 63.670, mag: 3.37 },  // 4 - ε Cas
        ],
        lines: [[1, 0], [0, 2], [2, 3], [3, 4]]
    },

    // ======================== ESCORPIO ========================
    {
        id: "scorpius",
        name: "Escorpio",
        abbr: "Sco",
        stars: [
            { name: "Antares",     ra: 16.490, dec: -26.432, mag: 0.96 },  // 0 - α Sco
            { name: "Graffias",    ra: 16.091, dec: -19.806, mag: 2.62 },  // 1 - β Sco
            { name: "Dschubba",    ra: 16.006, dec: -22.622, mag: 2.32 },  // 2 - δ Sco
            { name: "Sargas",      ra: 17.622, dec: -42.998, mag: 1.87 },  // 3 - θ Sco
            { name: "Shaula",      ra: 17.560, dec: -37.104, mag: 1.63 },  // 4 - λ Sco
            { name: "ε Sco",       ra: 16.836, dec: -34.293, mag: 2.29 },  // 5
            { name: "σ Sco",       ra: 16.353, dec: -25.593, mag: 2.89 },  // 6
            { name: "τ Sco",       ra: 16.599, dec: -28.216, mag: 2.82 },  // 7
            { name: "Lesath",      ra: 17.530, dec: -37.296, mag: 2.69 },  // 8 - υ Sco
        ],
        lines: [[1, 2], [2, 6], [6, 0], [0, 7], [7, 5], [5, 4], [4, 8], [4, 3]]
    },

    // ======================== LEO ========================
    {
        id: "leo",
        name: "Leo",
        abbr: "Leo",
        stars: [
            { name: "Regulus",     ra: 10.139, dec: 11.967, mag: 1.35 },  // 0 - α Leo
            { name: "Denebola",    ra: 11.818, dec: 14.572, mag: 2.14 },  // 1 - β Leo
            { name: "Algieba",     ra: 10.333, dec: 19.842, mag: 2.08 },  // 2 - γ Leo
            { name: "Zosma",       ra: 11.235, dec: 20.524, mag: 2.56 },  // 3 - δ Leo
            { name: "Ras Elased",  ra: 9.764,  dec: 23.774, mag: 2.98 },  // 4 - ε Leo
            { name: "Chertan",     ra: 11.237, dec: 15.430, mag: 3.34 },  // 5 - θ Leo
            { name: "η Leo",       ra: 10.122, dec: 16.763, mag: 3.52 },  // 6
        ],
        lines: [[4, 2], [2, 6], [6, 0], [0, 5], [5, 1], [2, 3], [3, 1]]
    },

    // ======================== CISNE (CYGNUS) ========================
    {
        id: "cygnus",
        name: "Cisne",
        abbr: "Cyg",
        stars: [
            { name: "Deneb",       ra: 20.690, dec: 45.281, mag: 1.25 },  // 0 - α Cyg
            { name: "Albireo",     ra: 19.512, dec: 27.960, mag: 3.08 },  // 1 - β Cyg
            { name: "Sadr",        ra: 20.370, dec: 40.257, mag: 2.20 },  // 2 - γ Cyg
            { name: "Gienah Cyg",  ra: 20.770, dec: 33.970, mag: 2.46 },  // 3 - ε Cyg
            { name: "δ Cyg",       ra: 19.750, dec: 45.131, mag: 2.87 },  // 4
        ],
        lines: [[0, 2], [2, 1], [4, 2], [2, 3]]
    },

    // ======================== LIRA ========================
    {
        id: "lyra",
        name: "Lira",
        abbr: "Lyr",
        stars: [
            { name: "Vega",     ra: 18.616, dec: 38.784, mag: 0.03 },  // 0 - α Lyr
            { name: "Sheliak",  ra: 18.835, dec: 33.363, mag: 3.45 },  // 1 - β Lyr
            { name: "Sulafat",  ra: 18.982, dec: 32.690, mag: 3.24 },  // 2 - γ Lyr
            { name: "δ1 Lyr",   ra: 18.908, dec: 36.899, mag: 4.22 },  // 3
            { name: "ζ1 Lyr",   ra: 18.746, dec: 37.605, mag: 4.37 },  // 4
        ],
        lines: [[0, 4], [4, 1], [1, 2], [2, 3], [3, 0]]
    },

    // ======================== ÁGUILA ========================
    {
        id: "aquila",
        name: "Águila",
        abbr: "Aql",
        stars: [
            { name: "Altair",   ra: 19.846, dec:  8.868, mag: 0.77 },  // 0 - α Aql
            { name: "Tarazed",  ra: 19.771, dec: 10.613, mag: 2.72 },  // 1 - γ Aql
            { name: "Alshain",  ra: 19.922, dec:  6.407, mag: 3.71 },  // 2 - β Aql
            { name: "δ Aql",    ra: 19.425, dec:  3.115, mag: 3.36 },  // 3
            { name: "ζ Aql",    ra: 19.090, dec: 13.863, mag: 2.99 },  // 4
            { name: "θ Aql",    ra: 20.188, dec: -0.822, mag: 3.24 },  // 5
            { name: "λ Aql",    ra: 19.104, dec: -4.883, mag: 3.44 },  // 6
        ],
        lines: [[4, 1], [1, 0], [0, 2], [2, 5], [3, 0], [3, 6]]
    },

    // ======================== GÉMINIS ========================
    {
        id: "gemini",
        name: "Géminis",
        abbr: "Gem",
        stars: [
            { name: "Castor",   ra: 7.577,  dec: 31.888, mag: 1.58 },  // 0 - α Gem
            { name: "Pollux",   ra: 7.755,  dec: 28.026, mag: 1.14 },  // 1 - β Gem
            { name: "Alhena",   ra: 6.629,  dec: 16.399, mag: 1.93 },  // 2 - γ Gem
            { name: "Mebsuta",  ra: 6.732,  dec: 25.131, mag: 3.06 },  // 3 - ε Gem
            { name: "Tejat",    ra: 6.383,  dec: 22.514, mag: 2.88 },  // 4 - μ Gem
            { name: "δ Gem",    ra: 7.335,  dec: 21.982, mag: 3.53 },  // 5
        ],
        lines: [[0, 1], [0, 4], [4, 3], [3, 5], [5, 2], [1, 5]]
    },

    // ======================== TAURO ========================
    {
        id: "taurus",
        name: "Tauro",
        abbr: "Tau",
        stars: [
            { name: "Aldebaran",  ra: 4.598,  dec: 16.509, mag: 0.85 },  // 0 - α Tau
            { name: "Elnath",     ra: 5.438,  dec: 28.608, mag: 1.65 },  // 1 - β Tau
            { name: "ζ Tau",      ra: 5.627,  dec: 21.143, mag: 3.00 },  // 2
            { name: "θ2 Tau",     ra: 4.478,  dec: 15.871, mag: 3.40 },  // 3
            { name: "ε Tau",      ra: 4.477,  dec: 19.180, mag: 3.54 },  // 4
            { name: "δ1 Tau",     ra: 4.382,  dec: 17.543, mag: 3.76 },  // 5
        ],
        lines: [[0, 3], [3, 5], [3, 4], [0, 2], [2, 1]]
    },

    // ======================== VIRGO ========================
    {
        id: "virgo",
        name: "Virgo",
        abbr: "Vir",
        stars: [
            { name: "Spica",      ra: 13.420, dec: -11.161, mag: 0.97 },  // 0 - α Vir
            { name: "Zavijava",   ra: 11.845, dec:  1.765, mag: 3.61 },  // 1 - β Vir
            { name: "Porrima",    ra: 12.694, dec: -1.449,  mag: 2.74 },  // 2 - γ Vir
            { name: "Auva",       ra: 12.927, dec:  3.397,  mag: 3.38 },  // 3 - δ Vir
            { name: "Vindemiatrix", ra: 13.036, dec: 10.959, mag: 2.83 },  // 4 - ε Vir
            { name: "η Vir",      ra: 12.332, dec: -0.667, mag: 3.89 },  // 5
        ],
        lines: [[1, 5], [5, 2], [2, 3], [3, 4], [2, 0]]
    },

    // ======================== ACUARIO ========================
    {
        id: "aquarius",
        name: "Acuario",
        abbr: "Aqr",
        stars: [
            { name: "Sadalsuud",   ra: 21.526, dec: -5.571,  mag: 2.91 },  // 0 - β Aqr
            { name: "Sadalmelik",  ra: 22.096, dec: -0.320,  mag: 2.96 },  // 1 - α Aqr
            { name: "Sadachbia",   ra: 22.361, dec: -1.387,  mag: 3.84 },  // 2 - γ Aqr
            { name: "Skat",        ra: 22.911, dec: -15.821, mag: 3.27 },  // 3 - δ Aqr
            { name: "ε Aqr",       ra: 20.794, dec: -9.496,  mag: 3.77 },  // 4
        ],
        lines: [[4, 0], [0, 1], [1, 2], [2, 3]]
    },

    // ======================== PISCIS ========================
    {
        id: "pisces",
        name: "Piscis",
        abbr: "Psc",
        stars: [
            { name: "Alrescha",  ra: 2.034,  dec:  2.764, mag: 3.82 },  // 0 - α Psc
            { name: "η Psc",     ra: 1.525,  dec: 15.346, mag: 3.62 },  // 1
            { name: "γ Psc",     ra: 23.286, dec:  3.282, mag: 3.70 },  // 2
            { name: "ω Psc",     ra: 23.988, dec:  6.864, mag: 4.01 },  // 3
            { name: "ι Psc",     ra: 23.666, dec:  5.627, mag: 4.13 },  // 4
        ],
        lines: [[1, 0], [0, 2], [2, 4], [4, 3]]
    },

    // ======================== ARIES ========================
    {
        id: "aries",
        name: "Aries",
        abbr: "Ari",
        stars: [
            { name: "Hamal",     ra: 2.120,  dec: 23.462, mag: 2.00 },  // 0 - α Ari
            { name: "Sheratan",  ra: 1.911,  dec: 20.808, mag: 2.64 },  // 1 - β Ari
            { name: "Mesarthim", ra: 1.892,  dec: 19.294, mag: 3.88 },  // 2 - γ Ari
            { name: "41 Ari",    ra: 2.833,  dec: 27.261, mag: 3.63 },  // 3
        ],
        lines: [[3, 0], [0, 1], [1, 2]]
    },

    // ======================== CÁNCER ========================
    {
        id: "cancer",
        name: "Cáncer",
        abbr: "Cnc",
        stars: [
            { name: "Acubens",   ra: 8.975,  dec: 11.858, mag: 4.25 },  // 0 - α Cnc
            { name: "Altarf",    ra: 8.275,  dec:  9.186, mag: 3.52 },  // 1 - β Cnc
            { name: "Asellus B", ra: 8.744,  dec: 21.469, mag: 3.94 },  // 2 - δ Cnc
            { name: "Asellus A", ra: 8.722,  dec: 18.154, mag: 4.66 },  // 3 - γ Cnc
            { name: "ι Cnc",     ra: 8.979,  dec: 28.762, mag: 4.03 },  // 4
        ],
        lines: [[1, 0], [0, 3], [3, 2], [2, 4]]
    },

    // ======================== CAPRICORNIO ========================
    {
        id: "capricornus",
        name: "Capricornio",
        abbr: "Cap",
        stars: [
            { name: "Algedi",     ra: 20.294, dec: -12.509, mag: 3.57 },  // 0 - α Cap
            { name: "Dabih",      ra: 20.350, dec: -14.781, mag: 3.08 },  // 1 - β Cap
            { name: "Nashira",    ra: 21.668, dec: -16.662, mag: 3.68 },  // 2 - γ Cap
            { name: "Deneb Alg",  ra: 21.784, dec: -16.127, mag: 2.87 },  // 3 - δ Cap
        ],
        lines: [[0, 1], [1, 3], [3, 2], [2, 0]]
    },

    // ======================== SAGITARIO ========================
    {
        id: "sagittarius",
        name: "Sagitario",
        abbr: "Sgr",
        stars: [
            { name: "Kaus Aust",  ra: 18.403, dec: -34.384, mag: 1.85 },  // 0 - ε Sgr
            { name: "Nunki",      ra: 18.921, dec: -26.297, mag: 2.02 },  // 1 - σ Sgr
            { name: "Ascella",    ra: 19.043, dec: -29.880, mag: 2.59 },  // 2 - ζ Sgr
            { name: "Kaus Media", ra: 18.350, dec: -29.828, mag: 2.70 },  // 3 - δ Sgr
            { name: "Kaus Bor",   ra: 18.229, dec: -25.422, mag: 2.81 },  // 4 - λ Sgr
            { name: "φ Sgr",      ra: 18.761, dec: -26.991, mag: 3.17 },  // 5
            { name: "τ Sgr",      ra: 19.116, dec: -27.670, mag: 3.32 },  // 6
        ],
        lines: [[0, 3], [3, 4], [4, 5], [5, 1], [1, 2], [2, 6], [3, 5]]
    },

    // ======================== LIBRA ========================
    {
        id: "libra",
        name: "Libra",
        abbr: "Lib",
        stars: [
            { name: "Zubenelg",   ra: 14.848, dec: -16.041, mag: 2.75 },  // 0 - α Lib
            { name: "Zubenesc",   ra: 15.283, dec: -9.383,  mag: 2.61 },  // 1 - β Lib
            { name: "Brachium",   ra: 15.592, dec: -14.790, mag: 3.91 },  // 2 - σ Lib
            { name: "γ Lib",      ra: 15.592, dec: -14.789, mag: 3.91 },  // 3
        ],
        lines: [[0, 1], [1, 2], [0, 2]]
    },

    // ======================== CAN MAYOR (CANIS MAJOR) ========================
    {
        id: "canis_major",
        name: "Can Mayor",
        abbr: "CMa",
        stars: [
            { name: "Sirio",     ra: 6.752,  dec: -16.716, mag: -1.46 },  // 0 - α CMa
            { name: "Adhara",    ra: 6.977,  dec: -28.972, mag: 1.50 },   // 1 - ε CMa
            { name: "Wezen",     ra: 7.140,  dec: -26.393, mag: 1.84 },   // 2 - δ CMa
            { name: "Mirzam",    ra: 6.378,  dec: -17.956, mag: 1.98 },   // 3 - β CMa
            { name: "Aludra",    ra: 7.402,  dec: -29.303, mag: 2.45 },   // 4 - η CMa
            { name: "Furud",     ra: 6.338,  dec: -30.063, mag: 3.02 },   // 5 - ζ CMa
        ],
        lines: [[3, 0], [0, 2], [2, 1], [2, 4], [1, 5], [3, 5]]
    },

    // ======================== CAN MENOR (CANIS MINOR) ========================
    {
        id: "canis_minor",
        name: "Can Menor",
        abbr: "CMi",
        stars: [
            { name: "Procyon",   ra: 7.655,  dec: 5.225, mag: 0.34 },  // 0 - α CMi
            { name: "Gomeisa",   ra: 7.453,  dec: 8.289, mag: 2.90 },  // 1 - β CMi
        ],
        lines: [[0, 1]]
    },

    // ======================== ANDRÓMEDA ========================
    {
        id: "andromeda",
        name: "Andrómeda",
        abbr: "And",
        stars: [
            { name: "Alpheratz",  ra: 0.140,  dec: 29.091, mag: 2.06 },  // 0 - α And
            { name: "Mirach",     ra: 1.162,  dec: 35.621, mag: 2.05 },  // 1 - β And
            { name: "Almach",     ra: 2.065,  dec: 42.330, mag: 2.17 },  // 2 - γ And
            { name: "δ And",      ra: 0.656,  dec: 30.861, mag: 3.27 },  // 3
        ],
        lines: [[0, 3], [3, 1], [1, 2]]
    },

    // ======================== PERSEO ========================
    {
        id: "perseus",
        name: "Perseo",
        abbr: "Per",
        stars: [
            { name: "Mirfak",   ra: 3.405,  dec: 49.861, mag: 1.80 },  // 0 - α Per
            { name: "Algol",    ra: 3.136,  dec: 40.957, mag: 2.12 },  // 1 - β Per
            { name: "ζ Per",    ra: 3.902,  dec: 31.884, mag: 2.85 },  // 2
            { name: "ε Per",    ra: 3.964,  dec: 40.010, mag: 2.89 },  // 3
            { name: "δ Per",    ra: 3.715,  dec: 47.788, mag: 3.01 },  // 4
        ],
        lines: [[0, 4], [0, 3], [3, 1], [1, 2], [4, 0]]
    },

    // ======================== PEGASO ========================
    {
        id: "pegasus",
        name: "Pegaso",
        abbr: "Peg",
        stars: [
            { name: "Markab",    ra: 23.079, dec: 15.205, mag: 2.49 },  // 0 - α Peg
            { name: "Scheat",    ra: 23.063, dec: 28.083, mag: 2.42 },  // 1 - β Peg
            { name: "Algenib",   ra: 0.220,  dec: 15.183, mag: 2.84 },  // 2 - γ Peg
            { name: "Enif",      ra: 21.736, dec:  9.875, mag: 2.39 },  // 3 - ε Peg
            // Alpheratz (α And) cierra el cuadrado — se referencia desde Andrómeda
        ],
        lines: [[0, 1], [0, 2], [3, 0]]
        // Nota: la línea Scheat-Alpheratz y Algenib-Alpheratz cruzan con Andrómeda
    },

    // ======================== CORONA BOREAL ========================
    {
        id: "corona_borealis",
        name: "Corona Boreal",
        abbr: "CrB",
        stars: [
            { name: "Alphecca",  ra: 15.578, dec: 26.715, mag: 2.23 },  // 0 - α CrB
            { name: "Nusakan",   ra: 15.464, dec: 29.106, mag: 3.68 },  // 1 - β CrB
            { name: "γ CrB",     ra: 15.713, dec: 26.296, mag: 3.84 },  // 2
            { name: "δ CrB",     ra: 15.827, dec: 26.069, mag: 4.59 },  // 3
            { name: "ε CrB",     ra: 15.960, dec: 26.878, mag: 4.15 },  // 4
            { name: "θ CrB",     ra: 15.549, dec: 31.359, mag: 4.14 },  // 5
        ],
        lines: [[5, 1], [1, 0], [0, 2], [2, 3], [3, 4]]
    },

    // ======================== BOYERO (BOÖTES) ========================
    {
        id: "bootes",
        name: "Boyero",
        abbr: "Boo",
        stars: [
            { name: "Arcturus",  ra: 14.261, dec: 19.182, mag: -0.05 },  // 0 - α Boo
            { name: "Izar",      ra: 14.750, dec: 27.074, mag: 2.37 },   // 1 - ε Boo
            { name: "Muphrid",   ra: 13.912, dec: 18.398, mag: 2.68 },   // 2 - η Boo
            { name: "Nekkar",    ra: 15.032, dec: 40.391, mag: 3.49 },   // 3 - β Boo
            { name: "γ Boo",     ra: 14.535, dec: 38.308, mag: 3.03 },   // 4
            { name: "δ Boo",     ra: 15.258, dec: 33.315, mag: 3.47 },   // 5
        ],
        lines: [[0, 2], [0, 1], [1, 4], [4, 3], [3, 5], [5, 1]]
    },

    // ======================== HÉRCULES ========================
    {
        id: "hercules",
        name: "Hércules",
        abbr: "Her",
        stars: [
            { name: "Kornephoros", ra: 16.504, dec: 21.490, mag: 2.77 },  // 0 - β Her
            { name: "Rasalgethi",  ra: 17.244, dec: 14.390, mag: 3.37 },  // 1 - α Her
            { name: "Sarin",       ra: 17.251, dec: 24.839, mag: 3.14 },  // 2 - δ Her
            { name: "π Her",       ra: 17.251, dec: 36.809, mag: 3.16 },  // 3
            { name: "ζ Her",       ra: 16.688, dec: 31.603, mag: 2.81 },  // 4
            { name: "η Her",       ra: 16.715, dec: 38.922, mag: 3.53 },  // 5
        ],
        lines: [[1, 2], [2, 0], [0, 4], [4, 5], [5, 3], [3, 2]]
    },

    // ======================== AURIGA ========================
    {
        id: "auriga",
        name: "Auriga",
        abbr: "Aur",
        stars: [
            { name: "Capella",    ra: 5.278,  dec: 45.998, mag: 0.08 },  // 0 - α Aur
            { name: "Menkalinan", ra: 5.992,  dec: 44.948, mag: 1.90 },  // 1 - β Aur
            { name: "θ Aur",      ra: 5.995,  dec: 37.213, mag: 2.62 },  // 2
            { name: "ι Aur",      ra: 4.950,  dec: 33.166, mag: 2.69 },  // 3
            { name: "ε Aur",      ra: 5.032,  dec: 43.823, mag: 2.99 },  // 4
        ],
        lines: [[0, 4], [4, 3], [3, 2], [2, 1], [1, 0]]
    },

    // ======================== CRUZ DEL SUR ========================
    {
        id: "crux",
        name: "Cruz del Sur",
        abbr: "Cru",
        stars: [
            { name: "Acrux",     ra: 12.443, dec: -63.099, mag: 0.76 },  // 0 - α Cru
            { name: "Mimosa",    ra: 12.795, dec: -59.689, mag: 1.25 },  // 1 - β Cru
            { name: "Gacrux",    ra: 12.519, dec: -57.113, mag: 1.63 },  // 2 - γ Cru
            { name: "δ Cru",     ra: 12.252, dec: -58.749, mag: 2.80 },  // 3
        ],
        lines: [[0, 2], [1, 3]]
    },

    // ======================== CENTAURO ========================
    {
        id: "centaurus",
        name: "Centauro",
        abbr: "Cen",
        stars: [
            { name: "Rigil Kent",  ra: 14.660, dec: -60.835, mag: -0.01 },  // 0 - α Cen
            { name: "Hadar",       ra: 14.064, dec: -60.373, mag: 0.61 },   // 1 - β Cen
            { name: "Menkent",     ra: 14.111, dec: -36.370, mag: 2.06 },   // 2 - θ Cen
            { name: "ε Cen",       ra: 13.665, dec: -53.467, mag: 2.30 },   // 3
            { name: "η Cen",       ra: 14.592, dec: -42.158, mag: 2.35 },   // 4
        ],
        lines: [[0, 1], [1, 3], [3, 2], [2, 4], [4, 0]]
    },
];
