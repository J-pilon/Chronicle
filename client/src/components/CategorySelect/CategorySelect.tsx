import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: 'black',
      backgroundColor: theme.palette.background.paper,
      width: '155px',
      margin: 'auto',
      borderRadius: '4px'
    },
  }),
);

const CategorySelect = (props) => {
  const { categories, setCategoryId, all } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  let options;
   all 
   ? options = [['Select a category', 0], ['All Entries', 'all'], ['No Category', null],
   ...categories.map(category => [category.name, category.id])]
   : options = [['Select a category', 0], ['No Category', null],
   ...categories.map(category => [category.name, category.id])];

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number, id: number | string) => {
    setCategoryId(id)
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Categories">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Category"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Select Category" 
          secondary={options.length ? options[selectedIndex][0] : ""} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option[1]}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, option[1])}
          >
            {option[0]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
};

export default CategorySelect;