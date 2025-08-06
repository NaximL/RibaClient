

import { SERVER_URL } from "../../config/config";

export async function GetDiary(token: string, studentId: string, month: number ,limit?: number) {

    const res = await fetch(`${SERVER_URL}/api/token/diary`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, studentId,limit, month }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при логине");
    }

    return res.json();
}

