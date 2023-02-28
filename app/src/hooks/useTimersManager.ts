import { createChromeStorageStateHookSync } from 'use-chrome-storage';
import useCurrentTime from './useCurrentTime';
import { v4 as uuid } from 'uuid';
import { useEffect, useMemo } from 'react';

export class Timer {
  name: string;
  start: number; // Timestamp
  end: number; // Timestamp
  dismissed: boolean = false;

  constructor(name: string, start: number, interval: number) {
    this.name = name;
    this.start = start;
    this.end = this.start + interval;
  }

  static fromStorage(timer: any) {
    return new Timer(timer.name, timer.start, timer.end - timer.start);
  }

  get interval() {
    return this.end - this.start;
  }

  remainingSeconds(currentTime: number) {
    return (this.end - currentTime) / 1000
  }

  percentageDone(currentTime: number) {
    return ((currentTime - this.start) / this.interval) * 100
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      start: this.start,
      end: this.end,
      dismissed: this.dismissed,
    });
  }
}

export type TimersManager = {
  timers: Map<string, Timer>,
  currentTime: number,
  addTimer: (name: string, interval: number) => void,
  deleteTimer: (id: string) => void,
  dismissTimer: (id: string) => void,
  clearTimers: () => void,
};

const STORAGE_KEY = "ARKHEIM_TIMER__TIMERS__STORAGE_KEY";
const INITIAL_VALUE = {};

const storageHook = createChromeStorageStateHookSync(
  STORAGE_KEY, INITIAL_VALUE
);

function useTimersManager(): TimersManager{
  const currentTime = useCurrentTime(100);
  const [storageObj, setStorageObj, , ] = storageHook();

  const timersMap = useMemo(() => {
    return new Map<string, Timer>(Object.entries(storageObj));
  }, [storageObj]);

  useEffect(() => {
    setStorageObj(Object.fromEntries(timersMap.entries()));
  }, [timersMap, setStorageObj]);

  useEffect(() => {
    // Whenever the map or time changes, check the active timers we have
    const activeTimers = [...timersMap.values()].reduce((acc, timer) => {
      const remaining = timer.remainingSeconds(currentTime);
      return (remaining <= 0 && !timer.dismissed) ? ++acc : acc;
      }, 0);
    chrome.action.setBadgeText({text: activeTimers.toString()});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timersMap, currentTime]);

  const addTimer = (name: string, interval: number) => {
    const id = uuid()
    const timer = new Timer(name, currentTime, interval)
    timersMap.set(id, timer);
    // Add it to chrome alarms
    chrome.alarms.create(id, {when: timer.end});
  };

  const dismissTimer = (id: string) => {
    const timer = timersMap.get(id);
    if (!timer) return;
    timer.dismissed = true;
    // Turn it off on chrome alarms
    chrome.alarms.clear(id);
  };

  const deleteTimer = (id: string) => {
    timersMap.delete(id);
    // Turn it off on chrome alarms
    chrome.alarms.clear(id);
  };

  const clearTimers = () => {
    timersMap.clear();
    chrome.alarms.clearAll();
  };

  return {
    timers: timersMap,
    currentTime,
    addTimer,
    deleteTimer,
    dismissTimer,
    clearTimers
  };
}

export default useTimersManager;
