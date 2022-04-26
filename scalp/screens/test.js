import { React, useState } from "react";


function test() {
  const [open,setOpen] = useState(false)
  const styles = {
    popup:{
      display: open ? "flex" : "none",
      opacity: open ? "1" : "0",
    }
  };
  return (
    <div className="main">
      <button className="open_button" onClick={()=>{setOpen(true)}}>Open!</button>
      <div className="popup" style={styles.popup}>
        <h1>This is a popup!</h1>
        <button className="close_button" onClick={()=>{setOpen(false)}}>Close!</button>
      </div>
    </div>
  );
}

export default test;