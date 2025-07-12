import { SERVER_URL } from "../../config/config";


export async function GetProfil(username:string, password:string) {
  const res = await fetch(`${SERVER_URL}/api/prof`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Ошибка при логине");
  }
  
  return res.json(); 
}
