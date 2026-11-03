import { useEffect } from 'react';
import { useStore } from '../../store/store';
import { bridge } from '../../bridge';

/** Fires task reminders (and missed ones once on launch). Runs in the renderer, which stays alive in the tray. */
export function Reminders() {
  useEffect(() => {
    const check = () => {
      const st = useStore.getState();
      const s = st.s;
      const now = Date.now();
      const fired: string[] = [];
      for (const t of s.tasks) {
        if (!t.remind || !t.due || !t.time || t.doneAt || t.habit) continue;
        const key = `${t.id}:${t.due}T${t.time}`;
        if (s.reminded.includes(key)) continue;
        const at = new Date(`${t.due}T${t.time}:00`).getTime();
        if (at > now || now - at > 3 * 86400000) continue;
        const missed = now - at > 3600000;
        const title = missed ? 'Missed reminder' : 'Reminder';
        if (bridge()) bridge()!.notify(title, t.title, t.id);
        else if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body: t.title });
        fired.push(key);
      }
      if (fired.length) st.patch((x) => ({ ...x, reminded: [...x.reminded.slice(-300), ...fired] }));
    };
    check();
    const iv = setInterval(check, 20000);
    return () => clearInterval(iv);
  }, []);
  return null;
}
