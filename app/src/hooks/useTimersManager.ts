import { createChromeStorageStateHookSync } from 'use-chrome-storage';
import useCurrentTime from './useCurrentTime';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

const STORAGE_KEY = "ARKHEIM_TIMER__TIMERS__STORAGE_KEY";
const ALARM_KEY = "ARKHEIM_TIMER";

export class Timer {
  id: string;
  name: string;
  start: number; // Timestamp
  end: number; // Timestamp
  dismissed: boolean;

  constructor(
    id: string, name: string, start: number, interval: number, dismissed: boolean
  ) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = this.start + interval;
    this.dismissed = dismissed;
  }

  static fromStorage(timer: any) {
    return new Timer(
      timer.id, timer.name, timer.start, timer.end - timer.start, timer.dismissed
    );
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

  toObject() {
    return {
      id: this.id,
      name: this.name,
      start: this.start,
      end: this.end,
      dismissed: this.dismissed,
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }
}

export type TimersManager = {
  timers: Array<Timer>,
  currentTime: number,
  addTimer: (name: string, interval: number) => void,
  deleteTimer: (id: string) => void,
  dismissTimer: (id: string) => void,
  clearTimers: () => void,
};

const INITIAL_VALUE = Array<Timer>();

const storageHook = createChromeStorageStateHookSync(
  STORAGE_KEY, INITIAL_VALUE
);

function useTimersManager(): TimersManager{
  const currentTime = useCurrentTime(100);
  const [storageObj, setStorageObj, , ] = storageHook();

  const timerArray = storageObj.map((t) => Timer.fromStorage(t));

  const encode = async (data: string) => {
    return ALARM_KEY + ";" + data
  }

  useEffect(() => {
    // Whenever the map or time changes, check the active timers we have
    const activeTimers = timerArray.reduce((acc, timer) => {
      const remaining = timer.remainingSeconds(currentTime);
      return (remaining <= 0 && !timer.dismissed) ? ++acc : acc;
    }, 0);
    chrome.action.setBadgeText({text: activeTimers.toString()});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  const addTimer = (name: string, interval: number) => {
    const timer = new Timer(uuid(), name, currentTime, interval, false);
    console.log(
      "[useTimersManager] ADDING TIMER",
      timerArray, { name, interval, id: timer.id }
    );
    setStorageObj([...timerArray, timer]);
    // Add it to chrome alarms
    encode(timer.id).then((code) => chrome.alarms.create(code, {when: timer.end}));
  };

  const dismissTimer = (id: string) => {
    console.log(
      "[useTimersManager] DISMISSING TIMER",
      timerArray, { id }
    );
    const newArray = timerArray.map((t) => {
      if (t.id !== id) return t;
      const newTimer = Timer.fromStorage(t.toObject());
      newTimer.dismissed = true;
      return newTimer;
    });
    setStorageObj(newArray);
    // Turn it off on chrome alarms
    encode(id).then((code) => chrome.alarms.clear(code));
  };

  const deleteTimer = (id: string) => {
    console.log(
      "[useTimersManager] DELETING TIMER",
      timerArray, { id }
    );
    const newArray = timerArray.filter((t) => t.id !== id);
    setStorageObj(newArray)
    // Turn it off on chrome alarms
    encode(id).then((code) => chrome.alarms.clear(code));
  };

  const clearTimers = () => {
    console.log("[useTimersManager] CLEARING ALL", timerArray);
    setStorageObj(new Array<Timer>());
    // Clear chrome alarms
    chrome.alarms.clearAll();
  };

  return {
    timers: timerArray,
    currentTime,
    addTimer,
    deleteTimer,
    dismissTimer,
    clearTimers
  };
}

export default useTimersManager;
