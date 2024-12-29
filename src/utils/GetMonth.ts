const monthes = [
  "يناير",
  "فبراير",
  "مارس",
  "ابريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export default function GetMonth(dates: string[]): string[] {
  const currentMonthes: string[] = [];
  dates.forEach((date) => {
    const noDublicate = currentMonthes.find(
      (m) => m === monthes[new Date(date).getMonth()]
    );
    if (!noDublicate) {
      const month = new Date(date).getMonth();
      currentMonthes.push(monthes[month]);
    }
  });
  return currentMonthes;
}
