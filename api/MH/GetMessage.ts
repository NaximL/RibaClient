

import { SERVER_URL } from "../../config/config";





export async function GetMessage(username:string, password:string,id:number) {
  const res = await fetch(`${SERVER_URL}/api/getmessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password,id }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Ошибка при логине");
  }

  return res.json(); 
}

