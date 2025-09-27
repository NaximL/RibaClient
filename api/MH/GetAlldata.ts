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

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Ошибка при запросе к ${endpoint}`);
    }
    if (res.status === 500) {
      const login = await getData('login');
      const password = await getData('password');
      if (!login || !password) return;
      const data = await Logins(login, password);
      await storeData('tokens', JSON.stringify(data.tokens));
      await fetchData(endpoint,token,date)
    }

    return res.json();
  } catch (error) {
    console.error(`Ошибка запроса к ${endpoint}:`, error);
    return null;
  }
}

