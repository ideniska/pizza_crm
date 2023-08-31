import React, { useEffect, useState } from "react";

const RefreshChecker = () => {
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime());
  const [refreshALert, setRefreshALert] = useState("")
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastRefreshTime;

      if (timeDifference > 5000) {
        setRefreshALert("⚠️ Данные не обновлялись более 5 минут и могли устареть, выполните новый поиск");
        setLastRefreshTime(currentTime);
      }
    }, 1000); // Check every second

    return () => clearInterval(refreshInterval);
  }, [lastRefreshTime]);

  return <p>{refreshALert}</p>;
};

export default RefreshChecker;
