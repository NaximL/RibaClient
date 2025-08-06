

import { SERVER_URL } from "../../config/config";

export async function RefreshToken(token:string) {

    const res = await fetch(`${SERVER_URL}/auth/token/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при логине");
    }

    return res.json();
}

