"use client";

import { useEffect, useState } from "react";

const format = () => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Denver",
    }).format(new Date());
  } catch {
    return "";
  }
};

// Local time at the house in Park City (Mountain Time), refreshed every 30 seconds. Renders empty on the
// server so the markup never disagrees with the visitor's clock.
export function ParkCityTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(format());
    const id = setInterval(() => setTime(format()), 30000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time}</span>;
}
