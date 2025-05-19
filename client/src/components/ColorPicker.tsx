import axios from 'axios';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useContext } from 'react'; 
import { UserContext } from '../hooks/UserContext';  
import SaveButton from './SaveButton';


const ColorPicker = (props: { color: string; setColor: (color: string) => void; name: string;}) => {

  const { color, setColor, name } = props
  const { userRef, setUser } = useContext(UserContext);   
  const user = userRef.current;
  const convertedName = name.toLowerCase() + '_hex';

  const colorPickerStyling = {
    backgroundColor: user ? user.background_hex : '#0b3c5d',
    color: user ? user.text_hex : '#d9b310',   
    margin: 15,
    paddingBottom: 15,
    paddingTop: 15,
    width: '40%',
    borderColor: user ? user.secondary_hex : 'black',
    borderStyle: 'solid',
    borderWidth: 8,
    borderRadius: 10,
    height: '100%',
  };

  const saveColor = (event: any) => {
    event.preventDefault();
    saveToDatabase();
  };

  const changeColor = (event: any) => {
    setColor(event)
    setUser({...user, [convertedName]: event});
  };

  const saveToDatabase = () => {
    axios.post(`/api/users/${user.id}`, {
      params: {
      [convertedName]: color
      }
    })
  };

  return (
    <form style={colorPickerStyling} onSubmit={saveColor}>
      <HexColorPicker color={color} onChange={changeColor} />
      <label> {name} Hex Value: </label>
      <span># <HexColorInput color={color} onChange={changeColor} name={name}/></span>
      <SaveButton save={saveColor} color={color} />
    </form>
  );
};
export default ColorPicker;