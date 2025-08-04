

import { SERVER_URL } from "../../config/config";

export async function GetHuman(token: string,value:number) {

    const res = await fetch(`${SERVER_URL}/api/gethuman`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token,value }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при логине");
    }

    return res.json();
}

