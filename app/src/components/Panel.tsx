import useTimers from '../hooks/useTimers';
import Timer from './Timer';


function Panel() {
  const [timers, setTimers] = useTimers();

  return (
    <div>
      <button onClick={() => setTimers([])}>Clear</button>
      { timers.map((timer, i) => <Timer timer={timer} key={i} />) }
    </div>
  );
}

export default Panel;