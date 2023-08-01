import React from 'react';
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/app-reducer'
import {Dispatch} from "redux";
import {ResponseType} from '../api/todolists-api'

// generic function

export function handleServerAppError <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) { //15 для меняющегося data ResponseType будет один, а <D> динамическим, т.е. для тудулист один, а для таск - другим
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>, error: { message: string }) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}