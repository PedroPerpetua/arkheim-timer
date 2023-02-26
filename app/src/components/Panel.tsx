import useTimersManager from '../hooks/useTimersManager';
import Timer from './Timer';
import AddTimer from './AddTimer';


function Panel() {
  const timersManager = useTimersManager();

  const handleAddTimer = (name: string, interval: number) => {
    timersManager.addTimer(name, interval);
  }

  const handleDelete = (id: string) => {
    timersManager.deleteTimer(id);
  }

  return (
    <div>
      <button onClick={timersManager.clearTimers}>Clear</button>
      <p>Current Time: {timersManager.currentTime}</p>
      <AddTimer handleFinish={handleAddTimer}/>
      {timersManager.list.map((timer, i) =>
        <Timer
          timer={timer} key={i}
          currentTime={timersManager.currentTime}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Panel;
