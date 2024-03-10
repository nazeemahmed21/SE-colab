// import * as React from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ZegoSuperBoardManager } from "zego-superboard-web";
import '../Style.css';
import Navbar from './Navbar';

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function Video() {
  const [isCallContainerVisible, setCallContainerVisible] = React.useState(true);
 
  const roomID = getUrlParams().get('roomID') || randomID(5);

  const myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1715142211;
    const serverSecret = "254c8faee0ebede42e04d36dfe600f88";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call

    zp.addPlugins({ ZegoSuperBoardManager })
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Copy link',
          url:
            window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      videoResolutionList: [
        ZegoUIKitPrebuilt.VideoResolution_360P,
        ZegoUIKitPrebuilt.VideoResolution_180P,
        ZegoUIKitPrebuilt.VideoResolution_480P,
        ZegoUIKitPrebuilt.VideoResolution_720P,
      ],
      videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      whiteboardConfig: {
        showAddImageButton: true,
      },
    });
  };

  const handleDeclineClick = () => {
    // Go back to the previous page
    window.history.back();
  };

  const handleButtonClick = () => {
    const container = document.querySelector('.myCallContainer');
    const callButtonContainer = document.querySelector('.call-container');
    if (container) {
      myMeeting(container);
       }
       if(callButtonContainer)
       setCallContainerVisible(false); // Hide the call container
  };


  return (

    <div className="call-container">
      <Navbar/>
      <p>To start a call please click the button below</p>
      <button onClick={handleButtonClick} className="accept">Call</button>
      {/* <button onClick={handleDeclineClick} className="decline">Decline</button> */}
       
      {/* {isCallContainerVisible && ( */}
        <div
          className="myCallContainer"
          style={{ width: '90vw', height: '65vh' }}
        ></div>
      {/* //  )}  */}
    </div>
  );
}

// import React from 'react'
// // import Navbar from '../components/Navbar'

// const Video = () => {
//   return (
//     <div>
//       {/* <Navbar/> */}
//       <h1>Video</h1>
//     </div>
//   )
// }

// export default Video