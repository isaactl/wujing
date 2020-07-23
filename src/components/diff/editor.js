import React, {useRef} from 'react'
import {MonacoDiffEditor} from 'react-monaco-editor'
import {Dialog} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const options = {
    selectOnLineNumbers: true,
    automaticLayout: false,
    fontSize: '18px',
    originalEditable: true,
    // readOnly: !props.editable
}

export default function DiffEditor(props) {
    const classes = useStyles()
    const monacoRef = useRef(null)

    function handleChange(newValue, e) {
    }

    function onCancel() {
    }

    // https://github.com/react-monaco-editor/react-monaco-editor/blob/master/src/diff.js#L19
    function onSave() {
        const {modified} = monacoRef.current.editor.getModel()
        console.log(modified.getValue())
    }

    return (
        <Dialog fullScreen open={props.open} onClose={onCancel}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onCancel} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Differ Viewer
                    </Typography>
                </Toolbar>
            </AppBar>
            <MonacoDiffEditor
                width="100%"
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