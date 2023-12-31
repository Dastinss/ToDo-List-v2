import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Box, Button, FormControl, IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(function(props: AddItemFormPropsType) {
    console.log("AddItemForm called")

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
                   disabled={props.disabled} // 15 добавили для необходимочсти задизейблить формочку добавления новой таски, если с тудулистом что-то происходит
        />
        <IconButton color="primary" onClick={addItem} disabled={props.disabled}> {/*// 15 добавили для необходимочсти задизейблить формочку добавления новой таски, если с тудулистом что-то происходит*/}
            <AddBox />
        </IconButton>
    </div>
})
