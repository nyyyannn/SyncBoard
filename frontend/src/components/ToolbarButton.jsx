import { useMemo } from "react";
import { Editor, createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

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

const ToolbarButton = ({ format, icon, type }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const isActive = type === 'mark' 
    ? CustomEditor.isMarkActive(editor, format)
    : CustomEditor.isBlockActive(editor, format);
  
  return (
    <button
      onMouseDown={event => {
        event.preventDefault();
        if (type === 'mark') {
          CustomEditor.toggleMark(editor, format);
        } else {
          CustomEditor.toggleBlock(editor, format);
        }
      }}
      style={{
        fontWeight: isActive ? 'bold' : 'normal',
        marginRight: '8px'
      }}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;