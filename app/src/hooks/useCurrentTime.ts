import { useEffect, useState } from 'react';

function getCurrentTime() {
  return (new Date()).getTime();
}


function useCurrentTime(updateRate = 500) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(getCurrentTime()),
      updateRate,
    );
    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

export default useCurrentTime;
