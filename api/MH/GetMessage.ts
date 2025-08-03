

import { SERVER_URL } from "../../config/config";





export async function GetMessage(token:string,id:number) {
  const res = await fetch(`${SERVER_URL}/api/onemessage`, {
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

