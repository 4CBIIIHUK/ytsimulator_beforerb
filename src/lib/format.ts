const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export function fmt(n: number, digits = 1): string {
  if (!isFinite(n)) return "∞";
  const neg = n < 0;
  let v = Math.abs(n);
  if (v < 1000) {
    const s = v < 10 && v % 1 !== 0 ? v.toFixed(digits) : Math.floor(v).toString();
    return (neg ? "-" : "") + s;
  }
  let i = 0;
  while (v >= 1000 && i < SUFFIXES.length - 1) {
    v /= 1000;
    i++;
  }
  if (v >= 1000) return (neg ? "-" : "") + n.toExponential(2);
  return (neg ? "-" : "") + v.toFixed(v >= 100 ? 0 : digits) + SUFFIXES[i];
}

export function money(n: number): string {
  if (Math.abs(n) < 1000) return "$" + (Math.abs(n) < 100 ? n.toFixed(2) : Math.round(n).toString());
  return "$" + fmt(n, 2);
}

export function mult(n: number): string {
  if (n >= 1000) return "x" + fmt(n, 2);
  return "x" + n.toFixed(2);
}

export function duration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = (x: number) => (x < 10 ? "0" + x : "" + x);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function ago(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s} сек назад`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин назад`;
  return `${Math.floor(m / 60)} ч назад`;
}
