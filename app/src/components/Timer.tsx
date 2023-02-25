import { Timer as TimerType } from '../hooks/useTimers';

type TimerProps = {
  timer: TimerType
}

function Timer({ timer }: TimerProps) {

  return (
    <div>
      { `${timer.name} -> ${new Date(timer.when)}` }
    </div>
  );
}

export default Timer;
