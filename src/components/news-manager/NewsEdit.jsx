import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';
import './newsEdit.scss'

export default function NewsEdit(props) {
    const [editorState, setEditorState] = useState(null);

    useEffect(() => {
        if (props.content === undefined) return;
        const contentBlock = htmlToDraft(props.content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props.content])
    return (
        <div>
            <Editor
                editorState={editorState}
                wrapperClassName='demo-wrapper'
                editorClassName="demo-editor"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            >
            </Editor>
            {/* <div>{draftToHtml(editorState)}</div> */}
        </div >
    )
}
