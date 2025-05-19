import Box from '@material-ui/core/Box';
import { smiley, mild, neutral, unhappy, angry } from '../emojis'

const moodStyling = {
  height: 60,
  padding: 0,
  margin: 0,
  display:'flex', 
  justifyContent: 'center',
  listStyle: 'none', 
  width: '100%'
};
  
export default function Mood(props) {

  const { mood, setMood, reset } = props;

  function clickHandler(index: number) {
    mood !== index 
    ? setMood(index) 
    : setMood(reset);
  }

  const emojiArr = [
    { src: angry, name: 'Very Unhappy' },
    { src: unhappy, name: 'Unhappy' },
    { src: neutral, name: 'Neutral' },
    { src: mild, name: 'Happy' },
    { src: smiley, name: 'Very Happy' }
    ];

  // The user can select an emoji as their mood
  const emojiList = emojiArr.map((emoji, index) => { 
    const emojiId = index + 1;
    return (
      <li 
      key={emojiId}  
      onClick={() => clickHandler(emojiId)}
      style={mood === (emojiId) 
      ? {opacity: 1, margin: 5} 
      : {opacity: 0.4, margin: 5}}>
        <img src={emoji.src} alt={emoji.name}/>
      </li>
    )})
    
  return (
    <Box>
      <ul style={moodStyling}>
        {emojiList}
      </ul>
    </Box>
  )
}

