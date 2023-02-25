import {
  Card, CardContent, CircularProgress, Typography, Box, Grid,
} from '@mui/material';
import { Timer as TimerType } from '../hooks/useTimers';

type CountdownSpinnerProps = {
  value: number
  remaining: number,
};

function formatSeconds(seconds: number) {
  function pad(num: number, size: number) {
    let retval = num.toString();
    while (retval.length < size) retval = "0" + retval;
    return retval;
  }
  const sec = Math.floor(seconds)
  if (sec < 60) return sec.toString();
  if (sec < 60*60) {
    const m = Math.floor(sec / 60);
    const s = sec - 60*m;
    return `${pad(m, 2)}:${pad(s, 2)}`;
  }
  const h = Math.floor(sec / (60*60));
  const m = Math.floor((sec - 60*60*h) / 60);
  const s = sec - 60*60*h - 60*m;
  return `${h}:${pad(m, 2)}:${pad(s, 2)}`;
}

function CountdownSpinner({ remaining, value }: CountdownSpinnerProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={value} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {formatSeconds(remaining)}
        </Typography>
      </Box>
    </Box>
  );
}

type TimerProps = {
  timer: TimerType,
  currentTime: number,
};

function Timer({ timer, currentTime }: TimerProps) {

  const total = timer.when - timer.started;
  const remaining = (timer.when - currentTime) / 1000;
  const progress = currentTime - timer.started;
  const percentage = (progress / total) * 100;

  console.log("TOTAL", total)
  console.log("PROGRESS", progress)
  console.log("PERCENTAGE", percentage)

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h5" component="div">
              {timer.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {
              remaining > 0
              ? <CountdownSpinner remaining={remaining} value={percentage} />
              : <Typography>Finished!</Typography>
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Timer;
