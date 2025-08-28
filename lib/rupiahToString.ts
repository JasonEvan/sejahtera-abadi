const units = [
  "nol",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

const tens = [
  "",
  "",
  "dua puluh",
  "tiga puluh",
  "empat puluh",
  "lima puluh",
  "enam puluh",
  "tujuh puluh",
  "delapan puluh",
  "sembilan puluh",
];

export function rupiahToString(value: number): string {
  value = Math.floor(value);

  if (value < 12) return units[value];
  if (value < 20) return units[value - 10] + " belas";
  if (value < 100) {
    const puluh = tens[Math.floor(value / 10)];
    const satuan = value % 10 === 0 ? "" : units[value % 10];
    return (puluh + " " + satuan).trim();
  }
  if (value < 200) {
    const rest = rupiahToString(value - 100);
    return ("seratus " + (rest === "nol" ? "" : rest)).trim();
  }
  if (value < 1000) {
    const ratus = units[Math.floor(value / 100)];
    const rest = rupiahToString(value % 100);
    return (ratus + " ratus " + (rest === "nol" ? "" : rest)).trim();
  }
  if (value < 2000) {
    const rest = rupiahToString(value - 1000);
    return ("seribu " + (rest === "nol" ? "" : rest)).trim();
  }
  if (value < 1000000) {
    const ribu = rupiahToString(Math.floor(value / 1000));
    const rest = rupiahToString(value % 1000);
    return (ribu + " ribu " + (rest === "nol" ? "" : rest)).trim();
  }
  if (value < 1000000000) {
    const juta = rupiahToString(Math.floor(value / 1000000));
    const rest = rupiahToString(value % 1000000);
    return (juta + " juta " + (rest === "nol" ? "" : rest)).trim();
  }

  return "nomor terlalu besar";
}
