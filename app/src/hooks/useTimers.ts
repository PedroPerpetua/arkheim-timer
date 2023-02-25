import { Dispatch, SetStateAction } from 'react';
import { createChromeStorageStateHookSync } from 'use-chrome-storage';

export type Timer = {
  name: string,
  started: number, // Timestamp
  when: number, // Timestamp
};

const STORAGE_KEY = "ARKHEIM_TIMER__TIMERS__STORAGE_KEY";
const INITIAL_VALUE = Array<Timer>();

const hook = createChromeStorageStateHookSync(STORAGE_KEY, INITIAL_VALUE);

function useTimers(): [Array<Timer>, Dispatch<SetStateAction<Timer[]>>]{
  const [timers, setTimers, isPersistent, error] = hook();
  return [timers, setTimers];
}

export default useTimers;
