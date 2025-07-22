import {useMemo } from 'react';
import { createEditor } from "slate";
import {Slate, Editable, withReact} from 'slate-react';
import {withHistory} from 'slate-history';
import {useStorage,useOthers,useMutation} from "@liveblocks/react";


const PresenceAvatars = () => {
  const others = useOthers();
  return(
    <div>
      {others.map(({connectionId, presence})=>{
        if(!presence||!presence.userInfo)
        {
          return null;
        }
        return (
          <div
            key = {connectionId}
            title = {presence.userInfo.name}
          >

            {presence.userInfo.name.charAt(0).toUpperCase()}

          </div>
        )
      })}
    </div>
  )
}

const CollaborativeEditor = () => {

  // At the top of your CollaborativeEditor component:
const updateContent = useMutation(({ storage }, newValue) => {
    storage.get("docContent").replace(newValue);
}, []);

  const docContent = useStorage(root=>root.docContent);

  const editor = useMemo(()=> withHistory(withReact(createEditor())),[]);

  if(docContent == null)
  {
    return <div>
      Loading document content....
    </div>
  }

  return (
    <>
      <div>
        <PresenceAvatars/>
        <hr style={{margin: '1rem 0'}}/>

        <Slate
          editor={editor}

          initialValue={docContent} //initialValue is shared data from LiveBlocks

          key={JSON.stringify(docContent)} //Every time the shared data changes from another user, this key change will re-render new content

          onChange={newValue => {
            updateContent(newValue)
          }}
          >

          <Editable
            placeholder="Start typing here. Write away to glory!"
          />


          </Slate>
      </div>
    </>
  )
}

export default CollaborativeEditor