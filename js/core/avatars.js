// Lógica de los avatares
export const DEFAULT_AVATAR = "../../../assets/avatars/avatar_default.svg";

export const AVATARS = [
    "../../../assets/avatars/avatar-alien.webp",
    "../../../assets/avatars/avatar-astronauta.webp",
    "../../../assets/avatars/avatar-blackhole.webp",
    "../../../assets/avatars/avatar-eclipse.webp",
    "../../../assets/avatars/avatar-galaxia.webp",
    "../../../assets/avatars/avatar-luna.webp",
    "../../../assets/avatars/avatar-nave.webp",
    "../../../assets/avatars/avatar-planeta.webp",
    "../../../assets/avatars/avatar-telescopio.webp"
];

export function getRandomAvatar() {
    return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
