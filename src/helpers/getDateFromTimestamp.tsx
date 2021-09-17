const getDateFromTimestamp = (
  timestamp: number,
  type: "time" | "date" | "day"
): string => {
  if (type === "date") {
    return new Date(timestamp * 1000).toLocaleDateString()
  } else if (type === "time") {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } else {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "short",
    })
  }
}

export default getDateFromTimestamp
