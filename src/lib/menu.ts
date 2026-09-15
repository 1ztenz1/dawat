/* This week's menu. Update every week (Monday's date + five days).
   Later this comes from the admin panel. */
export const weeklyMenu = {
  weekStart: "2026-09-14",
  poster: "/weekly-menu-poster.webp",
  days: [
    { day: "Monday", short: "Mon", nonveg: "Lahori Chicken Masala", sabzi: "Amritsari Paneer Bhurji" },
    { day: "Tuesday", short: "Tue", nonveg: "Chicken Changezi", sabzi: "Green Peas & Baingan Bharta" },
    { day: "Wednesday", short: "Wed", nonveg: "Egg Butter Masala", sabzi: "Kadai Mushroom" },
    { day: "Thursday", short: "Thu", nonveg: "Chicken Handi", sabzi: "Soya Tikka Masala" },
    { day: "Friday", short: "Fri", nonveg: "Chicken Dhaniya Adraki", sabzi: "Paneer Khurchan" },
  ],
};

export function menuWeekLabel() {
  const start = new Date(weeklyMenu.weekStart + "T12:00:00");
  const end = new Date(start);
  end.setDate(start.getDate() + 4);
  const month = (x: Date) => x.toLocaleDateString("en-US", { month: "short" });
  const sameMonth = start.getMonth() === end.getMonth();
  return `${month(start)} ${start.getDate()} – ${sameMonth ? "" : month(end) + " "}${end.getDate()}, ${end.getFullYear()}`;
}
