import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useEffect, useState, useContext, Fragment } from 'react';
import {useParams, useHistory} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../hooks/UserContext';

import Mood from './Home/Mood'
import { smiley, mild, neutral, unhappy, angry } from './emojis';

interface Params {entryId: string};
interface Data {
  title: string;
  content: string;
  privacy: boolean;
  category_id: number | string | null;
  date_created: Date | null;
  mood: number | string | null;
  user_id?: number | string;
  date?: Date | string;
};
interface Emojis {
  1: {src: string, name: string},
  2: {src: string, name: string},
  3: {src: string, name: string},
  4: {src: string, name: string},
  5: {src: string, name: string},
}

const Entry = () => {
  const history = useHistory();
  const { userRef } = useContext(UserContext);
  const user = userRef.current;
  const [ editMode, setEditMode ] = useState<boolean>(false)
  const [ content, setContent ] = useState<Data>({
    title: "",
    content: "",
    mood: 0,
    privacy: true,
    date_created: null,
    category_id: null,
  });
  
  const entryStyling = {
    backgroundColor: user ? user.background_hex : '#0b3c5d',
    color: user ? user.title_hex : '#d9b310',   
    height: 'fit-content',
    margin: 15,
    borderColor: user ? user.secondary_hex : 'black',
    borderStyle: 'solid',
    borderWidth: 10,
    borderRadius: 10,    
    titleStyling: {
      color: 'white',
      backgroundColor: user ? user.secondary_hex : 'rebeccapurple',
      marginTop: 0,
      paddingTop: 28,
      paddingBottom: 28,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },  
    buttonStyling: {
      margin: '1%'
    }
  }  
  
  const params: Params = useParams();
  const entryId = params.entryId;
  
  useEffect(() => {
    axios.get(`/api/entries/${entryId}`)
    .then(res => setContent({...res.data[0]})); // Do stuff with it
  }, [entryId]);
  
  const updateEntry = () => {
    console.log("CONTENT ", content);
    return axios.post(`/api/entries/${entryId}`, {
      params: { title: content.title, content: content.content, mood: content.mood, category_id: content.category_id, user_id: content.user_id, privacy: content.privacy }
    })
    .then(res => {console.log("DATA: ", res.data)
    return setEditMode(false)})
    .catch(err => console.log("ERROR: ", err));
  };

  const deleteEntry = () => {
    return axios.delete(`/api/entries/${entryId}`, {
      data: {
        user_id: user.id,
      }
    })
      .then(res => {
        console.log("DATA: ", res.data)
        return history.push('/entries');
      })
        .catch(err => console.log("ERROR: ", err));
      }

    // emojis for the users mood
    const imgs: Emojis = {
      1: {src: angry, name: 'Very Unhappy'},
      2: {src: unhappy, name: 'Unhappy'},
      3: {src: neutral, name: 'Neutral'},
      4: {src: mild, name: 'Happy'},
      5: {src: smiley, name: 'Very Happy'}
    };
  
  // displays emoji if entry has a mood
  function moodImage (num: number | string | null, imgObj: Emojis,  editStatus: boolean) {
    if (num && !editStatus) {
    return <p><img src={imgObj[num].src} alt={imgObj[num].name}/></p>;

    } else if (editStatus) {

      return <Mood />

    } else { return null}   
  }

  function titleHandler(event) {
    setContent(prev => ({...prev, title: event.target.value}))
  };

  function contentHandler(event) {
    setContent((prev) => ({...prev, content: event.target.value}))
  };

  const action = (val) => {
    if(val) {
      return (
        <Fragment>
          <Button variant="contained" color="primary" onClick={() => updateEntry()}>Save</Button>
          <Button variant="contained" color="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>Edit</Button>
          <Button variant="contained" color="secondary" onClick={() => deleteEntry()}>Delete</Button>
        </Fragment>
      )
    }
  }

  return (
    <div style={{height: '100%'}}>
      <div style={entryStyling.buttonStyling}>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        {moodImage(content.mood, imgs, editMode)}
      </div>     
        {action(editMode)}

      </div>
      {editMode 
      ? (<div style={entryStyling}>
          <form>
            <TextField 
              id="outlined-basic" 
              margin="normal"
              label="Title" 
              variant="outlined" 
              fullWidth
              value={content.title}
              onInput={titleHandler}/>

            <TextField 
              id="outlined-basic" 
              multiline
              rows="10"
              label="Whats on your mind?" 
              variant="outlined" 
              fullWidth
              value={content.content}
              onInput={contentHandler}/>
          </form>
        </div> )

      : (<div style={entryStyling}>
          <h1 style={entryStyling.titleStyling}>{content.title}</h1>
          <h2>{content.date}</h2>
          <p>{content.privacy}</p>
          <p style={{padding: '2%'}}>{content.content}</p>
        </div>)} 
        
    </div>
  );
};

export default Entry;