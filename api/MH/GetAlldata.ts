import { getData, storeData } from "@components/LocalStorage";
import { SERVER_URL } from "../../config/config";
import { Logins } from "./Login";

export async function fetchData(endpoint: string, token: string, date?: string) {
  try {
    const res = await fetch(`${SERVER_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, date }),
    });

    const data = await res.json();


    if (!res.ok) {
      throw new Error(data?.message || `Ошибка при запросе к ${endpoint}`);
    }


    if (res.status === 500 || (data?.error?.message === "An error has occurred.")) {
      const login = await getData("login");
      const password = await getData("password");
      if (!login || !password) return null;


      const newData = await Logins(login, password);
      if (!newData?.tokens) return null;

      await storeData("tokens", JSON.stringify(newData.tokens));

      const tok = await getData("tokens");
      if (!tok) return null;

      
      return fetchData(endpoint, JSON.parse(tok), date);
    }

    return data; 
  } catch (error) {
    console.error(`Ошибка запроса к ${endpoint}:`, error);
    return null;
  }
}