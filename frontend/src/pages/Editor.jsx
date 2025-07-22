import CollaborativeEditor from "../components/CollaborativeEditor";
import { useParams } from "react-router-dom";
import { RoomProvider } from "@liveblocks/react/suspense";
import {useAuth} from "../context/AuthContext";

const Editor = () => {
  const {id: docId} = useParams(); //assigning the id from the URL to docId
  const { user } = useAuth();

  const publicAPI = "pk_dev_hcuF-yVqgy31Xmt0-KijqIJ0xUTsqt8vXTUdPX2yRhcimqY_7nFjqN7UZB4-rWDZ";

  const userColor = "#"+Math.floor(Math.random()*16777215).toString(16); //.toString() converts it to hexadecimal format

  if(!user){
    return(
      <div>Loading user information....</div>
    )
  }

  return (
    <RoomProvider 
    id={docId} //must, creates room if it doesn't already exist
    publicApiKey={publicAPI}
    
    initialPresence={{ //each user has their own presence. Resets everytime they disconnect
      cursor: null, 
      userInfo:{
        name:user.username||"Anonymous",
        color:userColor,
      },
    }}>

    {/* Children of RoomProvider have access to the real-time room */}

    <div>
      <h1>Editing Document: {docId}</h1>
      <p>You are now connected to the live room for this document.</p>
      <CollaborativeEditor/>
    </div>
    </RoomProvider>
  )
}

export default Editor;