

import { SERVER_URL } from "../../config/config";

export async function SendMessage(token: string, touser: object, users: Array<any>, category: string, message: string, topic: string) {

    const res = await fetch(`${SERVER_URL}/api/sendmessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, touser, users, category, message, topic }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при логине");
    }

    return res.json();
}

