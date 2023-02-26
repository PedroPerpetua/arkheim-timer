import {
  Card, CardContent, CircularProgress, Typography, Box, Grid, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Timer as TimerType } from '../hooks/useTimersManager';

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

type CountdownSpinnerProps = {
  value: number
  remaining: number,
};

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
  handleDelete: (id: string) => void,
};

function Timer({ timer, currentTime, handleDelete }: TimerProps) {
  const remaining = timer.remainingSeconds(currentTime);
  const percentage = timer.percentageDone(currentTime);

  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={11}>
            <Typography
              sx={{ fontSize: 12 }}
              color="text.secondary"
              gutterBottom
            >
              {timer.id}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => handleDelete(timer.id)}
              size="small" color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" component="div" noWrap>
              {timer.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {
              remaining <= 0
              ? <Typography>Finished!</Typography>
              : <CountdownSpinner remaining={remaining} value={percentage} />
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Timer;
