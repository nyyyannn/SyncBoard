import {Children, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Editor, Transforms, Text } from "slate";
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

const CustomEditor ={
    isMarkActive(editor, format){
        const marks = Editor.marks(editor);
        return marks ? marks[format] === true: false;
    },

    isBlockActive(editor, format){
        const[match] = Editor.nodes(editor,{
            match: n=> n.type === format,
        });
        return !!match;
    },

    toggleMark(editor, format){
        const isActive = CustomEditor.isMarkActive(editor, format);
        if(isActive){
            Editor.removeMark(editor, format);
        }else{
            Editor.addMark(editor, format, true);
        }
    },

    toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(editor, format);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : format },
      { match: n => Editor.isBlock(editor, n) }
    );
  }
};

const CollaborativeEditor = () =>{

  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'bulleted-list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'list-item':
        return <li {...props.attributes}>{props.children}</li>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  // --- NEW: Custom renderer for marks ---
  const renderLeaf = useCallback(props => {
    let { children } = props;
    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    return <span {...props.attributes}>{children}</span>;
  }, []);
  
  
  if(docContent == null)
  {
    return <div>
      Loading document content....
    </div>
  }

  const editorStyles = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
    color: isDarkMode ? '#f0f0f0' : '#333',
  };

  return (
    <div style={editorStyles}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <PresenceAvatars />
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <hr style={{ margin: '1rem 0', borderColor: isDarkMode ? '#555' : '#eee' }} />
      
      {/* --- The Toolbar UI --- */}
      <div style={{ marginBottom: '1rem' }}>
        <ToolbarButton format="bold" icon="B" type="mark" />
        <ToolbarButton format="italic" icon="I" type="mark" />
        <ToolbarButton format="bulleted-list" icon="UL" type="block" />
      </div>

      <Slate editor={editor} initialValue={docContent} key={JSON.stringify(docContent)} onChange={handleOnChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start typing. Write away to glory!"
          style={{ minHeight: '300px', padding: '0 1rem' }}
          autoFocus
        />
      </Slate>
    </div>
  );
}

export default CollaborativeEditor;