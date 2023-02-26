import { createChromeStorageStateHookSync } from 'use-chrome-storage';
import useCurrentTime from './useCurrentTime';
import { v4 as uuid } from 'uuid';

export class Timer {
  id: string;
  name: string;
  start: number; // Timestamp
  end: number; // Timestamp

  constructor(name: string, start: number, interval: number) {
    this.id = uuid();
    this.name = name;
    this.start = start;
    this.end = this.start + interval;
  }

  static fromTimer(timer: Timer) {
    const newTimer = new Timer(
      timer.name, timer.start, timer.end - timer.start
    );
    newTimer.id = timer.id;
    return newTimer;
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
      id: this.id,
      name: this.name,
      start: this.start,
      end: this.end,
    });
  }
}

export type TimersManager = {
  list: Array<Timer>,
  currentTime: number,
  addTimer: (name: string, interval: number) => void,
  deleteTimer: (id: string) => void,
  clearTimers: () => void,
};

const STORAGE_KEY = "ARKHEIM_TIMER__TIMERS__STORAGE_KEY";
const INITIAL_VALUE = Array<Timer>();

const storageHook = createChromeStorageStateHookSync(
  STORAGE_KEY, INITIAL_VALUE
);

function useTimersManager(): TimersManager{
  const currentTime = useCurrentTime(100);
  const [timersList, setTimersList, , ] = storageHook();

  const addTimer = (name: string, interval: number) => {
    const timer = new Timer(name, currentTime, interval);
    setTimersList((list) => [...list, timer]);
    // TODO: add timer to Google Alarms
    // TODO: maybe insert sorted already?
  };

  const deleteTimer = (id: string) => {
    setTimersList((list) => list.filter((timer) => timer.id != id));
    // TODO: stop the google alarm
  };

  const clearTimers = () => {
    setTimersList([]);
    // TODO: clear all Google alarms
  }

  return {
    list: timersList.map((timer) => Timer.fromTimer(timer)),
    currentTime,
    addTimer,
    deleteTimer,
    clearTimers
  };
}

export default useTimersManager;
