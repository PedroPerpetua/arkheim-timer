import { useState } from 'react';
import {
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';
import useTimersManager from '../../hooks/useTimersManager';

function AddTimer() {
  const timersManager = useTimersManager();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = () => {
    timersManager.addTimer(
      name,
      description,
      (hours * 60 * 60 + minutes * 60 + seconds) * 1000
    );
    setName('');
    setDescription('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5">Add Timer</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="Hours"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                error={hours < 0}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                error={minutes < 0 || minutes >= 60}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="Seconds"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                error={seconds < 0 || seconds >= 60}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleSubmit}>
            Add alarm
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default AddTimer;
