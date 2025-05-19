import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import LineGraph from './graphs/LineGraph';
import PieGraph from './graphs/PieGraph';
import DatePicker from './DatePicker';
import { UserContext } from '../hooks/UserContext';



export default function Graphs() {
  
  const { userRef } = useContext(UserContext);
  const user = userRef.current;
  userRef.current = user;
  const graphStyling = {
    backgroundColor: user ? user.background_hex : '#0b3c5d',
    color: user ? user.text_hex : '#d9b310',   
    margin: 'auto',
    paddingBottom: 15,
    borderColor: user ? user.secondary_hex : 'black',
    borderStyle: 'solid',
    borderWidth: 8,
    borderRadius: 10,
    height: '90%',
    width: '90%',
    text: 'bold',
    marginTop: '20px',
  };

  const [startDate, setStartDate] = useState<null | Date>(new Date('2015-08-18'));
  const [endDate, setEndDate] = useState<null | Date>(new Date(Date.now()));
  const [pieData, setPieData] = useState<any>([{mood: 'Neutral', entries: 1}]);
  const [lineData, setLineData] = useState<any>([{mood: 1, date: '2019-08-30', best_fit: 1}]);

  useEffect(() => {
    // get pie chart data
  axios.get('/api/graph', {
    params: {
      type: 'pie',
      startDate,
      endDate
    }
  })
  .then((res) => {
    const moodNames = {
      1: 'Very Unhappy',
      2: 'Unhappy',
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy'
    };
    const stringifiedMood = res.data.map((count: {mood: number | string, entries: string}) => {
      count.mood = moodNames[count.mood]
      return count;
    })
    setPieData(stringifiedMood)
  });

  // get line graph data
  axios.get('/api/graph', {
    params: {
      type: 'line',
      startDate,
      endDate
    }
  })
    .then((res) => {
      // Add line of best fit
      const { data } = res
      for (let i = 0; i < data.length; i++) {
        (data[i + 1] && data[i - 1])
        ? data[i].best_fit = ((data[i - 1].mood + data[i].mood + data[i + 1].mood) / 3)
        : (data[i + 1])
        ? data[i].best_fit = ((data[i].mood + data[i + 1].mood) / 2)
        : data[i].best_fit = ((data[i - 1].mood + data[i].mood) / 2 )
      }
      setLineData(data)
    });
  }, [startDate, endDate])

  return (
  <table style={graphStyling}>
  <PieGraph data={pieData} startDate={startDate} endDate={endDate} />
  <DatePicker 
    id="date-picker-start-date" 
    name="Start Date"
    date={startDate}
    setDate={setStartDate} />
  <DatePicker 
    id="date-picker-end-date" 
    name="End Date" 
    date={endDate}
    setDate={setEndDate}/>
  <LineGraph data={lineData} startDate={startDate} endDate={endDate} />
  </table>
  );
}