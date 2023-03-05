import { useState } from 'react';
import {
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Modal,
  Box,
} from '@mui/material';
import useTimersManager from '../../hooks/useTimersManager';
import './AddTimer.css';

function AddTimer() {
  const timersManager = useTimersManager();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState<number | null>(0);
  const [minutes, setMinutes] = useState<number | null>(0);
  const [seconds, setSeconds] = useState<number | null>(0);

  const handleClose = () => {
    setIsOpen(false);
    setName('');
    setDescription('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleSubmit = () => {
    timersManager.addTimer(
      name,
      description,
      ((hours ?? 0) * 60 * 60 + (minutes ?? 0) * 60 + (seconds ?? 0)) * 1000
    );
    handleClose();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add a timer</Button>
      <Modal open={isOpen} onClose={handleClose}>
        <Box className="add_timer__modal_box">
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Add Timer</Typography>
                </Grid>
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
                    minRows={4}
                    maxRows={4}
                    rows={4}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="number"
                    label="Hours"
                    value={hours}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text === '') {
                        setHours(null);
                        return;
                      }
                      const value = Number(e.target.value);
                      if (value >= 0) setHours(value);
                    }}
                    onBlur={(e) => {
                      setHours(hours ?? 0);
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="number"
                    label="Minutes"
                    value={minutes}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text === '') {
                        setMinutes(null);
                        return;
                      }
                      const value = Number(e.target.value);
                      if (value >= 0 && value < 60) setMinutes(value);
                    }}
                    onBlur={(e) => {
                      setMinutes(minutes ?? 0);
                    }}
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="number"
                    label="Seconds"
                    value={seconds}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text === '') {
                        setSeconds(null);
                        return;
                      }
                      const value = Number(e.target.value);
                      if (value >= 0 && value < 60) setSeconds(value);
                    }}
                    onBlur={(e) => {
                      setSeconds(seconds ?? 0);
                    }}
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
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
        </Box>
      </Modal>
    </>
  );
}

export default AddTimer;
