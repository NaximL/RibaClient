import { SERVER_URL } from "../../config/config";





export async function GetLesion(username:string, password:string,math:boolean) {
  const res = await fetch(`${SERVER_URL}/api/rozklad`, {
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
  const fs = await res.json();
  let rozkl = '';
  try {
    const now = new Date();
    const hor =now.getHours()
    const min = now.getMinutes()
    const re = now.getDay(); 
    const lessonsForToday = fs[re - 1];

    if (lessonsForToday && lessonsForToday.length > 0) {
      lessonsForToday.forEach((urk: any) => {
        const [startTime, endTime] = urk.time.split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
     

        if (
          (hor > startHour || (hor === startHour && min >= startMinute)) &&
          (hor < endHour || (hor === endHour && min <= endMinute))
        ) {
          rozkl = `${urk.urok}\nЧас: ${urk.time}`;
        }
        
      });
    } else {
      rozkl = 'На даний момент уроків немає.';
     
    }
  } catch (error) {
    console.error('Помилка при обробці розкладу:', error);
    rozkl = 'Не вдалося отримати розклад.';
  }
 
  if (math) {
    return rozkl;
  }
  else {
    return fs;
  }
}

