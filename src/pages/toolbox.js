import React from 'react'
import Navbar from '../components/Navbar'
import '../styles/toolbox.css'
import { Icon } from '@iconify/react';
import ad2 from '../images/ad2.gif';

const Toolbox = () => {
  return (
    <><div>
      <Navbar />
      {/* <h1>Toolbox</h1> */}
    </div><div className="menu">
        <p className="text1">Tool Box</p>
        <p className="text2">Please choose from our extensive tools gathered to meet your requirements</p>
        <p><br></br></p>
        <img className="box" src={require("./box.png")} />

        <a href="https://ansongeo.github.io/photoeditor" class="btn" id="one">
          <Icon icon="tabler:photo" height="40px" />
          Photo Editing
        </a>

        <a href="https://www.kapwing.com/studio/editor" class="btn" id="two">
          <Icon icon="gridicons:video" height="40px" />
          Video Editing
        </a>

        <a href="https://www.blackbox.ai/agent/Co-LabChatbotJS0yczR" class="btn" id="three">
          <Icon icon="eos-icons:ai" height="40px" />
          <p></p>AI Help
        </a>

        <a href="https://imaadmmi.github.io/Diagram-Editor/" class="btn" id="four">
          <Icon icon="octicon:graph-16" height="40px" />
          Diagrams
        </a>

        <a href="https://whiteboard-host.onrender.com/" class="btn" id="five">
          <Icon icon="fluent:draw-text-20-filled" height="40px" />
          Whiteboard
        </a>

        <a href="https://docs.google.com/document/u/0/" target="_blank" class="btn" id="six">
          <Icon icon="arcticons:google-docs" height="40px" />
          Docs
        </a>

        <a href="https://docs.google.com/presentation/u/0/" target="_blank" class="btn" id="seven">
          <Icon icon="arcticons:google-slides" height="40px" />
          Slides
        </a>

        <a href="https://docs.google.com/spreadsheets/u/0/" target="_blank" class="btn" id="eight">
          <Icon icon="arcticons:google-sheets" height="40px" />
          Sheets
        </a>

      </div>
      <div className="ad-container">
      <div className="ad">
        Advertisement
         <img src={ad2} alt="Ad GIF" />
      </div>
    </div> 
      </>
  )
}

export default Toolbox