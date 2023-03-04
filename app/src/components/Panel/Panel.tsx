import useTimersManager from '../../hooks/useTimersManager';
import Timer from '../timer/Timer';
import AddTimer from '../add-timer/AddTimer';
import './Panel.css';

function Panel() {
  const timersManager = useTimersManager();

  return (
    <div className="panel">
      <button onClick={timersManager.clearTimers}>Clear</button>
      <p>Current Time: {timersManager.currentTime}</p>
      <AddTimer />
      {[...timersManager.timers]
        .sort((t1, t2) => t1.end - t2.end)
        .map((timer, i) => (
          <Timer key={i} timer={timer} />
        ))}
    </div>
  );
}

export default Panel;
