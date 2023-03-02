import useTimersManager from '../../hooks/useTimersManager';
import Timer from '../timer/Timer';
import AddTimer from '../add-timer/AddTimer';
import './Panel.css';

function Panel() {
  const timersManager = useTimersManager();

  const handleAddTimer = (name: string, interval: number) => {
    timersManager.addTimer(name, interval);
  };

  const handleDelete = (id: string) => {
    timersManager.deleteTimer(id);
  };

  const handleDismiss = (id: string) => {
    timersManager.dismissTimer(id);
  };

  return (
    <div className="panel">
      <button onClick={timersManager.clearTimers}>Clear</button>
      <p>Current Time: {timersManager.currentTime}</p>
      <AddTimer handleFinish={handleAddTimer} />
      {[...timersManager.timers]
        .sort((t1, t2) => t1.end - t2.end)
        .map((timer, i) => (
          <Timer
            key={i}
            timer={timer}
            currentTime={timersManager.currentTime}
            onDelete={handleDelete}
            onDismiss={handleDismiss}
          />
        ))}
    </div>
  );
}

export default Panel;
