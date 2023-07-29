//#15  редьюсер для обработки состояния каких-то аспектов, касающихся всего приложения, таких как: выбранный язык интерфейса, загружаются ли данные или нет, кто именно сейчас залогинен в систему

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' // 15 - расширяемая типизация для крутилок-загрузок

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string // добавили новое свойство в редьюсер. error будет равна либо строке (в которой будет сообщение об ошибки) либо null, если ошибки не будет
}
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}

        case 'APP/SET-ERROR':
            return {...state, error: action.error}

        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)

type ActionsType = SetAppStatusType | SetAppErrorType