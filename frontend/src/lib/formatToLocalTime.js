function formatToLocalTime(isoString) {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    weekday: "short", // e.g., "Fri"
    // year: "numeric", // e.g., "2025"
    month: "long", // e.g., "July"
    day: "numeric", // e.g., "4"
    hour: "2-digit", // e.g., "06"
    minute: "2-digit", // e.g., "13"
    second: "2-digit", // e.g., "42"
    hour12: true, // use 12-hour format
  });
}

export default formatToLocalTime;
