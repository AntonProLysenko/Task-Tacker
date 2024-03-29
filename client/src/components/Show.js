import{ useEffect, useState} from "react"
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import MDEditor from "@uiw/react-md-editor";

import * as usersService from "../utilities/user-service";
import Layout from "../screens/layout/Layout";

function Show({ buttonPressed, setButtonPressed, setIsOpen,task,setTask,fetchShow, showBodyValue,setBodyValue, editOpen,open, setErrorMessage, setErrorCode, onClose, BASIC_URL }) {
  const idpar = useParams();
  const navigation = useNavigate();
  

  // let[currentBody, setCurrentBody] = useState([])



  useEffect(() => {
    async function getTask(id) {
      try {
        await usersService.checkToken();
        const { data } = await axios.get(`${BASIC_URL}/tasks/${id}`);
        await setTask(data);
        setBodyValue(data.body);        
        if(data){
          open(true);
        }
      } catch (error) {
        if(error.response){
          setErrorMessage(error.response.data.message);
          setErrorCode(error.response.status);
          navigation("*");
        }else{
          setErrorMessage("Server is not responding");
          setErrorCode("444");
          navigation("*")
        }
        // alert(`Server responded with code:${error.response.status} message: ${error.response.statusText}${error.response.data.message}`);
      }
    }
    getTask(idpar.id);
  }, [fetchShow]);


  const handleArchivation = async (statusChange, currentStatus, id) => {
    try {
      if (currentStatus !== "ARCHIVE") {
        const { status } = await axios.put(`${BASIC_URL}/tasks/${id}`, {
          status: statusChange,
          prevStatus: currentStatus,
        });
        if (status === 200) {
          setButtonPressed(!buttonPressed);
        } else {
          alert("Something went wrong!");
        }
      } else {
        await axios.delete(`${BASIC_URL}/tasks/${id}`);
        setButtonPressed(!buttonPressed);
      }
    } catch (error) {
      alert("Something went wrong!" + error);
    }
  };

 
  let hidebles =  document.querySelectorAll(".showHideble");
  hidebles.forEach((hideble) => {
    if (editOpen) {
      hideble.classList.add("pseudo");
    } else {
      if (hideble.classList.contains("pseudo")) {
        hideble.classList.remove("pseudo");
      }
    }
  });
    







  function loaded(){
    let lastUpdate = moment(task.updatedAt).fromNow();
    return (
      <>
        <Layout />
        <div className="overlay" onClick={onClose}>
          <div className="modalContainer">
            <div className="showHeader">
              <button className="close showHideble" onClick={onClose}>
                x
              </button>

              <h1 className="listTitle showHideble editable" onClick={() => setIsOpen(true)}>{task.entry}</h1>

              <div className="secondaryInfo showHideble">
                <p className="taskStatus">
                  In {task.status.charAt(0).toUpperCase() + task.status.slice(1).toLowerCase()} list
                </p>

                <p className="date">Updated: {lastUpdate} </p>
              </div>
            </div>

            <div className="showInfo showHideble">
              <h3>Instructions:</h3>

              {task.body ? (
                <div className="instructions"  data-color-mode="light">
                  {/* {arrBody.map((li, idx) => {
                      if (arrBody[arrBody.length - 1] !== "") {
                        return <p key={idx}> {li} </p>;
                      } else {
                        arrBody.pop();
                        return <p key={idx}> {li} </p>;
                      }
                    })} */}
                    <div onClick={() => setIsOpen(true)}>

                  <MDEditor.Markdown  className="editable"  source={showBodyValue} style={{borderRadius:"5px"}} />
                    </div>
                  {task.status === "ARCHIVE" ? (
                    <button className="singleBtn" onClick={() => { navigation(`/`); handleArchivation("ARCHIVE", task.status, task._id); }}>
                      Delete Forever
                    </button>
                  ) : (
                    <div className="moveBtn showBtn">
                      <button onClick={() => setIsOpen(true)}>Edit</button>
                      <button
                        onClick={() => {
                          handleArchivation("ARCHIVE", task.status, task._id);
                          navigation(`/`);
                        }}
                      >
                        Archivate{" "}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="emptyInstructions editable" onClick={() => setIsOpen(true)}></div>
                  {task.status === "ARCHIVE" ? (
                    <button
                      className="singleBtn"
                      onClick={() => {
                        navigation(`/`);
                        handleArchivation("ARCHIVE", task.status, task._id);
                      }}
                    >
                      Delete Forever
                    </button>
                  ) : (
                    <div className="moveBtn showBtn">
                      <button onClick={() => setIsOpen(true)}>Edit</button>
                      <button
                        onClick={() => {
                          handleArchivation("ARCHIVE", task.status, task._id);
                          navigation(`/`);
                        }}
                      >
                        Archivate{" "}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="pseudo"></div>
          </div>
        </div>
      </>
    );
  }



  return (task._id===idpar.id? 
      loaded()
   : <>
     <Layout />
        <div className="overlay" onClick={onClose}>
          <div className="modalContainer">
            <button className="close" >
                x
              </button>
              <h1 className="listTitle showHideble">Loading...</h1>
              <div></div>
          </div>
        </div>
   </>
        
  );
}

export default Show;
