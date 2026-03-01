/* CATÁLOGO DE ESTRELLAS BRILLANTES (mag ≤ 4.0) — Coordenadas J2000
   Estrellas de fondo NO incluidas ya en constellations.js.
   Se usan para el campo estelar de fondo realista. */

export const BACKGROUND_STARS = [
    // === Estrellas de mag negativa y muy brillantes ===
    { ra: 6.399, dec: -52.696, mag: -0.72 },  // Canopus (α Car)
    { ra: 14.040, dec: -60.373, mag: 0.61 },  // (duplicada de Hadar, omitir si ya está)
    { ra: 18.616, dec: 38.784, mag: 0.03 },  // Vega - ya en Lira
    { ra: 5.242, dec: -8.201, mag: 0.13 },  // Rigel - ya en Orión

    // === Estrellas brillantes adicionales ===
    { ra: 22.960, dec: -29.622, mag: 1.16 },  // Fomalhaut (α PsA)
    { ra: 7.393, dec: -37.097, mag: 1.50 },  // ε CMa
    { ra: 1.628, dec: -57.237, mag: 0.46 },  // Achernar (α Eri)
    { ra: 20.427, dec: -0.822, mag: 2.00 },  // β Aqr zone
    { ra: 12.263, dec: -17.542, mag: 2.59 },  //  γ Crv - Corvus
    { ra: 12.498, dec: -23.397, mag: 2.65 },  // γ Crt - Cráter
    { ra: 8.159, dec: -47.337, mag: 1.68 },  // Avior (ε Car)
    { ra: 6.112, dec: -17.054, mag: 2.10 },  // μ CMa zone
    { ra: 9.220, dec: -69.717, mag: 1.68 },  // Miaplacidus (β Car)
    { ra: 6.977, dec: -28.972, mag: 1.50 },  // ya en CMa
    { ra: 10.333, dec: -70.038, mag: 2.76 },  // ι Car
    { ra: 22.137, dec: -46.961, mag: 1.74 },  // Alnair (α Gru)
    { ra: 0.438, dec: -42.306, mag: 2.39 },  // β Phe
    { ra: 17.943, dec: 51.489, mag: 3.17 },  // δ Dra
    { ra: 15.737, dec: -3.430, mag: 2.73 },  // αSerp (Unukalhai)
    { ra: 12.140, dec: -24.728, mag: 2.69 },  // γ Crv (Gienah)
    { ra: 12.573, dec: -23.397, mag: 2.94 },  // δ Crv
    { ra: 12.169, dec: -22.620, mag: 2.59 },  // β Crv
    { ra: 12.297, dec: -16.516, mag: 2.99 },  // α Crv (Alchiba)

    // === Estrellas de mag 3.0-4.0 para densidad ===
    { ra: 3.038, dec: 4.090, mag: 3.73 },  // δ Cet
    { ra: 0.726, dec: -17.987, mag: 2.04 },  // Diphda (β Cet)
    { ra: 3.405, dec: 9.029, mag: 3.47 },  // ξ Tau
    { ra: 4.330, dec: 15.628, mag: 3.65 },  // ε Tau (Ain) - ya incluido parcialm
    { ra: 18.355, dec: -8.244, mag: 3.36 },  // η Oph
    { ra: 16.305, dec: -4.693, mag: 2.43 },  // δ Oph
    { ra: 17.173, dec: -15.725, mag: 3.27 },  // θ Oph
    { ra: 16.619, dec: -10.567, mag: 2.56 },  // ζ Oph
    { ra: 17.366, dec: 12.560, mag: 2.08 },  // Ras Alhague (α Oph)
    { ra: 17.724, dec: 4.567, mag: 2.43 },  // Cebalrai (β Oph)
    { ra: 19.846, dec: 8.868, mag: 0.77 },  // Altair — ya en Águila
    { ra: 20.690, dec: 45.281, mag: 1.25 },  // Deneb — ya en Cisne
    { ra: 0.945, dec: 60.717, mag: 2.47 },  // γ Cas — ya en Casiopea

    // === Llenar con más estrellas (mag 3.5-4.5) para densidad ===
    { ra: 2.833, dec: -40.305, mag: 3.56 },
    { ra: 4.477, dec: -55.045, mag: 3.26 },
    { ra: 5.528, dec: -20.759, mag: 3.60 },
    { ra: 6.629, dec: 16.399, mag: 1.93 },  // Alhena — ya en Gem
    { ra: 8.922, dec: 48.042, mag: 3.14 },
    { ra: 9.314, dec: -8.659, mag: 3.11 },  // Alphard zone
    { ra: 9.460, dec: -8.659, mag: 1.98 },  // Alphard (α Hya)
    { ra: 10.827, dec: -49.420, mag: 3.13 },
    { ra: 11.550, dec: -63.020, mag: 2.60 },
    { ra: 13.398, dec: -36.712, mag: 3.02 },
    { ra: 14.698, dec: -47.388, mag: 2.55 },
    { ra: 16.006, dec: -22.622, mag: 2.32 },  // Dschubba — ya en Sco
    { ra: 17.150, dec: 36.876, mag: 3.67 },
    { ra: 18.185, dec: 72.733, mag: 3.29 },
    { ra: 19.209, dec: 67.661, mag: 3.07 },
    { ra: 20.189, dec: -12.544, mag: 3.77 },
    { ra: 20.749, dec: 61.839, mag: 3.35 },
    { ra: 21.264, dec: 62.586, mag: 3.52 },
    { ra: 21.309, dec: -5.025, mag: 3.73 },
    { ra: 22.717, dec: 30.221, mag: 3.40 },
    { ra: 23.565, dec: 77.632, mag: 3.21 },
    { ra: 0.167, dec: 29.091, mag: 3.61 },
    { ra: 1.101, dec: -10.182, mag: 3.56 },
    { ra: 2.064, dec: 42.330, mag: 2.17 },  // Almach — ya en And
    { ra: 3.037, dec: 53.507, mag: 3.98 },
    { ra: 3.791, dec: 24.113, mag: 3.72 },
    { ra: 5.627, dec: 21.143, mag: 3.00 },  // ζ Tau
    { ra: 7.017, dec: -23.833, mag: 3.95 },
    { ra: 8.305, dec: -59.510, mag: 3.32 },
    { ra: 9.133, dec: 36.803, mag: 3.82 },
    { ra: 10.278, dec: 23.417, mag: 3.44 },
    { ra: 11.235, dec: 20.524, mag: 2.56 },  // Zosma — ya en Leo
    { ra: 13.792, dec: 49.313, mag: 1.86 },  // Alkaid — ya en UMa
    { ra: 14.845, dec: 74.156, mag: 2.08 },  // Kochab
    { ra: 15.578, dec: 26.715, mag: 2.23 },  // Alphecca
    { ra: 16.490, dec: -26.432, mag: 0.96 },  // Antares
    { ra: 17.560, dec: -37.104, mag: 1.63 },  // Shaula
    { ra: 18.403, dec: -34.384, mag: 1.85 },  // Kaus Australis
    { ra: 19.512, dec: 27.960, mag: 3.08 },  // Albireo
    { ra: 21.736, dec: 9.875, mag: 2.39 },  // Enif
];
