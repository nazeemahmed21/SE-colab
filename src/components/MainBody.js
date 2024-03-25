import React from 'react'
import { MdOutlineStorage, MdMoreVert } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaFolderOpen } from "react-icons/fa";
import '../styles/MainBody.css';
import forms from '../images/forms.png';

function MainBody() {
  return (
    <div className='mainbody'>
      <div className='mainbody_top'>
        <div className='mainbody_top_left' style={{fontSize:"16px", fontWeight:"500"}}>
          Reset Forms
        </div>
        <div className='mainbody_top_right'>
          <div className='mainbody_top_center' style={{ fontSize: "14px", marginRight: "125px" }}>Owned by anyone <RiArrowDropDownLine /></div>
          <MdOutlineStorage style={{fontSize:"16px", color:"black"}}/>
          <FaFolderOpen style={{fontSize:"16px", color:"black"}}/>  
        </div>
      </div>
      <div className='mainbody_docs'>
        <div className='mainbody_doc_card'>
          <img src={forms} className='mainbody_doc_image' alt=''/>
          <div className='mainbody_doc_card_content'>
            <h5></h5>
            <div className='mainbody_doc_content' style={{fontSize:"12px", color:"grey"}}>
              <div className='mainbody_content_left'>
                <MdOutlineStorage style={{color:"white", fontSize:"12px", backgroundColor:"#29ada0", padding:"3px", marginRight:"3px", borderRadius:"2px"}}/>
              </div>
              <MdMoreVert style={{fontSize:"16px", color:"#29ada0"}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainBody