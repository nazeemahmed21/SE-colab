import React, { useState } from 'react';
import { reminders, updateReminder } from './firebaseforreminder';
import '../styles/reminder.css'

const Reminder = () => {
  const [refresh, setRefresh] = useState(false);
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
      <div className='halfreminders'>
        <><p className='reminderstitle'>Reminders</p></>
        <button className='refbuttonreminders' onClick={handleRefresh}>refresh</button>
        {reminders && reminders.length > 0 ? (
          <><div className='maindivreminders'>
            {reminders.map((r) => (
              <><div key={r.id} className='textdivreminders'>
                <p style={{ textDecoration: strike[r.id] ? 'line-through' : 'none' }}>{r.title}</p>
                <button className='donereminders' onClick={() => { updateReminder(r.id); handleStrike(r.id) }}>&#x2713;</button>
              </div > <><br></br></></>
            ))}
          </div>
          </>
        ) : (
          <div className='maindivreminders'>
            <div className='emptytextreminders'> No reminders! </div>
          </div>
        )}
      </div >
    </>
  );
}

export default Reminder;