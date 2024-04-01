import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/toolbox.css'
import { Icon } from '@iconify/react';
import ad2 from '../images/ad2.gif';
import box from '../images/box.png';
const Toolbox = () => {
  const [ContainerVisible, setContainerVisible] = useState(true);
  const handleCloseContainer = () => {
    setContainerVisible(false);
  }

  return (
    <><div>
      
    </div><div className="tlbxmenu">
        <p className="tlbxtext1">Tool Box</p>
        <p className="tlbxtext2">Please choose from our extensive tools gathered to meet your requirements</p>
        <p><br></br></p>
        <img className="tlbxbox" src={box} />

        <a href="https://ansongeo.github.io/photoeditor" target="_blank" rel="noreferrer" className="toolboxbtn" id="one">
          <Icon icon="tabler:photo" height="40px" />
          Photo Editing
        </a>

        <a href="https://www.kapwing.com/studio/editor" target="_blank" rel="noreferrer" className="toolboxbtn" id="two">
          <Icon icon="gridicons:video" height="38px" />
          Video Editing
        </a>

        <a href="https://www.blackbox.ai/agent/Co-LabChatbotJS0yczR" target="_blank" rel="noreferrer" className="toolboxbtn" id="three">
          <Icon icon="eos-icons:ai" height="40px" />
          <p></p>AI Help
        </a>

        <a href="https://imaadmmi.github.io/Diagram-Editor/" target="_blank" rel="noreferrer" className="toolboxbtn" id="four">
          <Icon icon="octicon:graph-16" height="38px" />
          Diagrams
        </a>

        <a href="https://whiteboard-host.onrender.com/" target="_blank" rel="noreferrer" className="toolboxbtn" id="five">
          <Icon icon="fluent:draw-text-20-filled" height="40px" />
          Whiteboard
        </a>

        <a href="https://docs.google.com/document/u/0/" target="_blank" rel="noreferrer" className="toolboxbtn" id="six">
          <Icon icon="arcticons:google-docs" height="40px" />
          Docs
        </a>

        <a href="https://docs.google.com/presentation/u/0/" target="_blank" rel="noreferrer" className="toolboxbtn" id="seven">
          <Icon icon="arcticons:google-slides" height="40px" />
          Slides
        </a>

        <a href="https://docs.google.com/spreadsheets/u/0/" target="_blank" rel="noreferrer" className="toolboxbtn" id="eight">
          <Icon icon="arcticons:google-sheets" height="40px" />
          Sheets
        </a>

      </div>
      {ContainerVisible && (
        <div className="tlbxad-container">
          <div className="tlbxad">
            Advertisement
            <button onClick={handleCloseContainer}>x</button>
            <img src={ad2} alt="Ad GIF" />
          </div>
        </div>
      )}
    </>
  )
}

export default Toolbox