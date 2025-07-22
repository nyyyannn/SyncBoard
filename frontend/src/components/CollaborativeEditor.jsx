import React from 'react'
import { useMyPresence } from "@liveblocks/react/suspense";

const CollaborativeEditor = () => {

  const [myPresence, updateMyPresence] = useMyPresence();

  useEffect(()=>{
    console.log("My current presence:", myPresence);
  },[myPresence]);

  return (
    <>
      <p><strong>Next Step:</strong> Build the Slate.js editor here.</p>
      <p>Your name in presence: <strong>{myPresence.userInfo.name}</strong></p>
    </>
  )
}

export default CollaborativeEditor