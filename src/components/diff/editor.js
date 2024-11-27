import { Dialog } from "@material-ui/core";
import React, { useRef } from 'react';
import { MonacoDiffEditor } from 'react-monaco-editor';

const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    fontSize: '18px',
    originalEditable: true,
    wordWrap: "on",
    // readOnly: !props.editable
};

export default function DiffEditor(props) {
    const monacoRef = useRef(null);

    // // https://github.com/react-monaco-editor/react-monaco-editor/blob/master/src/diff.js#L19
    // function onSave() {
    //     const {modified} = monacoRef.current.editor.getModel()
    //     console.log(modified.getValue())
    // }

    return (
        <Dialog fullScreen open={props.open} onClose={onCancel}>
            <MonacoDiffEditor
                height="100%"
                language="yaml"
                theme="vs-dark"
                ref={monacoRef}
                original=""
                value=""
                options={options}
                onChange={handleChange}
            />
        </Dialog>
    );
}