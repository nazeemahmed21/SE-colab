import React, { useState, useEffect } from 'react';
import { reminders, updateReminder } from './firebaseforreminder';
import '../styles/reminder.css'
import { PageTitle } from "../components/combinedTodo";

const Reminder = () => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {

  }, [reminders])

  const handleRefresh = () => {
    setRefresh(!refresh);
  }

  const [strikeState, setStrikeState] = useState({});

  const handleStrike = (reminderID) => {
    setStrikeState(prevState => ({
      ...prevState,
      [reminderID]: !prevState[reminderID]
    }));
  }

  return (
    <>
      <div className='half'>
        <><PageTitle>Reminders</PageTitle></>
        <button className='button' onClick={handleRefresh}>refresh</button>
        {reminders && reminders.length > 0 ? (
          <><div className='maindiv'>
            {reminders.map((r) => (
              <><div key={r.id} className='textdiv'>
                <p style={{ textDecoration: strikeState[r.id] ? 'line-through' : 'none' }}>{r.title}</p>
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