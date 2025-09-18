import { getData, storeData } from "@components/LocalStorage";
import { SERVER_URL, UPDATE_SCHEDULE } from "../../config/config";
import useDateStore from "@store/DateStore";

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

    return res.json();
  } catch (error) {
    console.error(`Ошибка запроса к ${endpoint}:`, error);
    return null;
  }
}

export async function GetAllData(token: string,setDate:(Date:Date)=>void) {

  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + 1);
  setDate(dateObj);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate() - 1).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}T21:00:00+00:00`;


  const numd = await getData('schedulenum')
  if (!numd) {
    console.log('schedule create')
    await storeData('schedulenum', JSON.stringify(UPDATE_SCHEDULE));
    const sc = await fetchData("schedule", token);
    await storeData('schedule', JSON.stringify(sc));
  }
  if (Number(numd) < UPDATE_SCHEDULE) {
    console.log('schedule update')
    await storeData('schedulenum', JSON.stringify(UPDATE_SCHEDULE));
    const sc = await fetchData("schedule", token);
    await storeData('schedule', JSON.stringify(sc));
  }

  const profiles = await getData('profile')
  if (!profiles) {
    const d = await fetchData("profile", token);
    await storeData('profile', JSON.stringify(d));
  }



  const sch = await getData('schedule')
  const prof = await getData('profile')
  if (!sch || !prof) return
  const endpoints = [
    JSON.parse(sch),
    fetchData("message", token),
    fetchData("messagesendmes", token),
    JSON.parse(prof),
    fetchData("homework", token, date),
  ];

  const [schedule, message, messagesendmes, profile, homework] = await Promise.all(endpoints);
  return [[], homework || [], schedule || [], profile || [], message || [], messagesendmes || []];
}