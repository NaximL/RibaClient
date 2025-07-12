import { SERVER_URL } from "../../config/config";


export async function GetHomeWork(username:string, password:string) {
  const res = await fetch(`${SERVER_URL}/api/domash`, {
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
