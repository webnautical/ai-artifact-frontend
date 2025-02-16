import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
const CKEditorCom = ({ handleEditorChange, ckValue }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start typings...'
    }), []);
    // const handleChange = () => {
    //     const data = editor.getData();
    //     handleEditorChange(data)
    // };
    return (
        <>
            <JoditEditor
                ref={editor}
                value={ckValue}
                config={config}
                tabIndex={1}
                onBlur={newContent => handleEditorChange(newContent)}
                onChange={newContent =>handleEditorChange(newContent)}
            />
        </>
    )
}

export default CKEditorCom