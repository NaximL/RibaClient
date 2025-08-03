import { SERVER_URL } from "../../config/config";

async function fetchData(endpoint: string, token: string, date?: string) {
  try {
    const res = await fetch(`${SERVER_URL}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, date }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Ошибка при запросе к ${endpoint}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Ошибка запроса к ${endpoint}:`, error);
    return null;
  }
}

export async function GetAllData(token: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());

  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() - 2).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}T21:00:00+00:00`;

  const results = await Promise.allSettled([
    fetchData("schedule", token),
    fetchData("message", token),
    fetchData("profile", token),
    fetchData("homework", token, date),
  ]);

  const [scheduleResult, messageResult,profileResult, homeworkResult] = results;

  const schedule = scheduleResult.status === "fulfilled" ? scheduleResult.value : [];
  const message = messageResult.status === "fulfilled" ? messageResult.value : [];
  const profile = profileResult.status === "fulfilled" ? profileResult.value : [];
  const homework = homeworkResult.status === "fulfilled" ? homeworkResult.value : [];

  return [
    [],
    homework,
    schedule,
    profile,
    message,
  ];
}