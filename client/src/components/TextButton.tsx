import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

export default function TextButton(props) {
  const classes = useStyles();
  const { color, text } = props;
  
  const handleButtonClick = (event) => {
    props.onClick();
    
  };
  return (
    <div className={classes.root}>
      <Button color={color}
      onClick={handleButtonClick}>
        {text}
      </Button>
    </div>
  );
}