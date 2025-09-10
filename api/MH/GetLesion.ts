export async function GetLesion(fs: Array<any>, setUrok: (Urok: string) => void) {
  let rozkl = '';
  try {
    const now = new Date();
    const re = now.getDay(); 

    const lessonsForToday = fs[re - 1];

    if (!lessonsForToday || lessonsForToday.length === 0) {
      return 'На даний момент уроків немає.';
    }
    if (now.getHours() < 8) {
      return 'Уроки ще не почались.';
    }

    let found = false;

    for (let i = 0; i < lessonsForToday.length; i++) {
      const urk = lessonsForToday[i];
      const [startTime, endTime] = urk.time.split(' - ');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0, 0);
      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0, 0);

      if (now >= startDate && now <= endDate) {
        setUrok(JSON.stringify({ d: re - 1, u: i }));
        rozkl = `${urk.urok}\nЧас: ${urk.time}`;
        found = true;
        break;
      }

      if (now < startDate) {
        const diffMs = startDate.getTime() - now.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        rozkl = `Перерва, наступний: ${urk.urok} через ${diffMin} хв.`;
        found = true;
        break;
      }
    }

    if (!found) {
      rozkl = 'Уроки на сьогодні закінчились.';
    }
  } catch (error) {
    console.error('Помилка при обробці розкладу:', error);
    rozkl = 'Не вдалося отримати розклад.';
  }

  return rozkl;
}