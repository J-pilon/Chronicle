import 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker(props: {name: string, id: string, date: null | Date, setDate: Dispatch<SetStateAction<null | Date>>}) {
 
  const handleDateChange = (date: Date | null) => {

    props.setDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id={props.id}
          label={props.name}
          format="MM/dd/yyyy"
          value={props.date}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}