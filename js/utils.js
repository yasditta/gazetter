export function timestampToHours(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  const h = new Date(date).getHours();
  const m = new Date(date).getMinutes();

  const output = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  return output;
}
