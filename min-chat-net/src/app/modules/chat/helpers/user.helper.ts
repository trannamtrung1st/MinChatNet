import { RANDOM_AVATARS } from "../chat.constant";

export const randomUser = (displayName: string) => {
    return {
        avatar: RANDOM_AVATARS[Math.random() > 0.5 ? 0 : 1],
        displayName: displayName
    };
};