

import { SERVER_URL } from "../../config/config";





export async function GetMessageSend(token:string,id:number) {
  const res = await fetch(`${SERVER_URL}/api/onemessagesend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token,id }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Ошибка при логине");
  }

  return res.json(); 
}

