import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';

export function DatePicker(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label={props.label ? props.label : "Date picker dialog"}
          format="MM/dd/yyyy"
          value={props.startdate}
          onChange={props.onDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
export function TimePicker(props) {
  if (props.running === true) {
    return (
      <Grid container justify="space-around">
        <TextField
          value="Tracking"
          disabled='true'
        />
      </Grid>
    )
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          views={['hours', 'minutes', 'seconds']}
          format="HH:mm:ss"
          opento='hours'
          label={props.label ? props.label : "Time picker"}
          value={props.time}
          onChange={props.onTimeChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}