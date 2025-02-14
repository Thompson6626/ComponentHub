import { environment } from "./environment";

const userUrl = `${environment.apiUrl}/users`;

export const userConfig = {
    updatePassword: `${userUrl}/password`,
    updateUsername: `${userUrl}/username`,
    currentUserDetails: `${userUrl}/me`,
    userDetails: `${userUrl}/{username}`,
}
