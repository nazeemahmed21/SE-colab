// ForwardDialog.js
import React from 'react';
import '../Style.css';

const ForwardDialog = ({ messageId, messageText, users, onClose, onForward }) => {
    console.log(users);

    return (
    <div className="forward-dialog">
      <h2>Forward Message</h2>
      <p>{messageText}</p>
      <div className="button-container">
        {users && users.length > 0 ? (  
          users.map((user) => (
            <button key={user
            .id} onClick={() => onForward(messageId, user.id)}>
              {/* {user.name} */}
              {users}
            </button>
          ))
        ) : (
          <p>No users available</p>
        )}
        
         <button onClick={onClose}>Forward</button>
         

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ForwardDialog;
