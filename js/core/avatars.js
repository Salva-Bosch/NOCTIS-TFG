// Lógica de los avatares
export const AVATARS = [
    "../../../assets/avatars/avatar-alien.png",
    "../../../assets/avatars/avatar-astronauta.png",
    "../../../assets/avatars/avatar-blackhole.png",
    "../../../assets/avatars/avatar-eclipse.png",
    "../../../assets/avatars/avatar-galaxia.png",
    "../../../assets/avatars/avatar-luna.png",
    "../../../assets/avatars/avatar-nave.png",
    "../../../assets/avatars/avatar-planeta.png",
    "../../../assets/avatars/avatar-telescopio.png"
];

export function getRandomAvatar() {
    return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
