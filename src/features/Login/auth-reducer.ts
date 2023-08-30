import {Dispatch} from 'redux'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}

        case 'login/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}

        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const setIsInitializedAC = (value: boolean) =>
    ({type: 'login/SET-IS-INITIALIZED', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await authAPI.login(data)
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res, dispatch)
        }
    } catch (err: any) {
        handleServerNetworkError(dispatch, err)
    }
}

export const initializeAppTC = () => (dispatch: Dispatch<ActionsType>) => {
    authAPI.me().then(res => {
        // debugger
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setIsInitializedAC(true))
        } else {
            dispatch(setIsInitializedAC(true))
        }
    })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res, dispatch)
            }
        })
        .catch((err) => {
            handleServerNetworkError(dispatch, err)
        })
}


// types
type ActionsType =
    ReturnType<typeof setIsInitializedAC>
    | ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType