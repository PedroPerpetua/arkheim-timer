import useCurrentTime from '../hooks/useCurrentTime';
import useTimers from '../hooks/useTimers';
import Timer from './Timer';
import AddTimer from './AddTimer';


function Panel() {
  const currentTime = useCurrentTime(100);
  const [timers, setTimers] = useTimers();

  const handleAddTimer = (name: string, interval: number) => {
    setTimers([
      ...timers, { name, started: currentTime, when: currentTime + interval }
    ])
  }

  return (
    <div>
      <button onClick={() => setTimers([])}>Clear</button>
      <p>Current Time: {currentTime}</p>
      <AddTimer handleFinish={handleAddTimer}/>
      {timers.map((timer, i) =>
        <Timer timer={timer} currentTime={currentTime} key={i} />
      )}
    </div>
  );
}

export default Panel;
