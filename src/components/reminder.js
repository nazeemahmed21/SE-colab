import React, { useState, useEffect } from 'react';
import { reminders, updateReminder } from '../firebase';
import '../styles/reminder.css'
import { PageTitle } from "../components/combinedTodo";
import fetchid from '../firebase';

const Reminder = () => {
  const [refresh, setRefresh] = useState(false);

    // useEffect(() => {

    // }, [reminders])

  const handleRefresh = () => {
    setRefresh(!refresh);
  }

  const [strike, setStrike] = useState({});

  const handleStrike = (reminderID) => {
    setStrike(prevState => ({
      ...prevState,
      [reminderID]: !prevState[reminderID]
    }));
  }

  return (
    <>
      <div className='half'>
        <><PageTitle>Reminders</PageTitle></>
        <button className='refbutton' onClick={handleRefresh}>refresh</button>
        {reminders && reminders.length > 0 ? (
          <><div className='maindiv'>
            {reminders.map((r) => (
              <><div key={r.id} className='textdiv'>
                <p style={{ textDecoration: strike[r.id] ? 'line-through' : 'none' }}>{r.title}</p>
                <button className='done' onClick={() => { updateReminder(r.id); handleStrike(r.id) }}>&#x2713;</button>
              </div > <><br></br></></>
            ))}
          </div>
          </>
        ) : (
          <div className='maindiv'>
            <div className='emptytext'> No reminders! </div>
          </div>
        )}
      </div >
    </>
  );
}

export default Reminder;