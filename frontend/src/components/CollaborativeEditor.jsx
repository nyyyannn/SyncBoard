import {Children, useCallback, useEffect, useMemo } from 'react';
import { createEditor } from "slate";
import {Slate, Editable, withReact} from 'slate-react';
import {withHistory} from 'slate-history';
import {useStorage,useOthers,useMutation} from "@liveblocks/react";

const INITIAL_CONTENT = [
  {
    type: 'paragraph',
    children: [{text:''}],
  }
];


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
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: presence.userInfo.color,
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)'
            }}
          >

            {presence.userInfo.name.charAt(0).toUpperCase()}

          </div>
        )
      })}
    </div>
  )
}

const CollaborativeEditor = () =>{

  const docContent = useStorage(root=>root.docContent);

  const updateContent = useMutation(({ storage }, newValue) => {
      storage.set("docContent",newValue);
  }, []);

  const initializeDocument = useMutation(({storage})=>{
    const content = storage.get("docContent");
    if(content==null)
    {
      storage.set("docContent",INITIAL_CONTENT);
    }
  },[]);

  useEffect(() => {
    if(docContent!==null)
    {
        initializeDocument();   
    }
  }, [initializeDocument, docContent]);

  const editor = useMemo(()=> withHistory(withReact(createEditor())),[]);

  const handleOnChange = useCallback((newValue)=>{
    updateContent(newValue);
  },[updateContent]);

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

          onChange={handleOnChange}
          >

          <Editable
            placeholder="Start typing here. Write away to glory!"
            style={{minHeight:'150px', padding:'0 1rem'}}
            autoFocus
          />

        </Slate>
      </div>
    </>
  )
}

export default CollaborativeEditor;