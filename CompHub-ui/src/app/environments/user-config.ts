import { environment } from "./environment";

const userUrl = `${environment.apiUrl}/users`;

export const userConfig = {
    updatePassword: `${userUrl}/password`,
    updateUsername: `${userUrl}/username`,
    currentUserDetails: `${userUrl}/me`,
    userDetails: `${userUrl}/{username}`,
    isUsernameTaken: `${userUrl}/availability/username/{username}`,
    isEmailAssociated: `${userUrl}/availability/email/{email}`
}
