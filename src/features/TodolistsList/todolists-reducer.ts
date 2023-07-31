import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorType,
    setAppStatusAC,
    SetAppStatusType
} from "../../app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'})) // бежим мапом и добавляем фильтр
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map((tl) => tl.id === action.id ? {...tl, entityStatus: action.status} : tl) //
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'SET-TODOLISTS',
    todolists
} as const) //14 АС который будет устанавливать наше значение в стейте
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    id,
    status
} as const)


// thunks
export const fetchTodolistsTC = () => { // 14 создали Thunk для общения этого редьюсера как BLL с DAL уровнем
    return (dispatch: Dispatch<ActionsType>) => { // в момент получения thunk у нас идет ПЕРВЫЙ ассинхронный запрос
        dispatch(setAppStatusAC('loading'))// 15 старт ассинхронного запроса по отражению todoLists
        todolistsAPI.getTodolists() // 14 ассинхронный запрос на API Димыча мы из BLL дедаем запрос в DAL, что архитекрутрно правильно, поэтому И перенелсли эту логику в Thunk т.е. в todolist-reduser из UI т.е. из TodoLists
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))// 15 финиш ассинхронного запроса по отражению todoLists
            })
    }
}

// enum ResultCode { // применякм, чтобы не лезть на сервер новым людям и не вникать, что за коды ошибок, их отсутвия и пр
//     ok=0,
//     Error,
//     capcha
// }

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))// 15 старт ассинхронного запроса по отражению todoLists
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatusAC('succeeded'))// 15 старт ассинхронного запроса по отражению todoLists
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0])) // 15 добаваили, что если есть ошибка, то необходимо вывести сообщение об ошибке с нулевым индексом т.е. первую ошибку
                    } else {
                        dispatch(setAppErrorAC('Some Error occurred')) // 15 добаваили хардкод, если случится ошибка без описания
                    }
                }
            })
            .catch((error) => { // 15 отлавливаем ошибку по невозможности удаления в случае отсутствия NetWork
                dispatch(setAppStatusAC('failed')) // убираем загрузку
                dispatch(changeTodolistEntityStatusAC(todolistId, 'failed')) // убираем дизебл
                dispatch(setAppErrorAC(error.message)) // добавляем описание ошибки
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))// 15 старт ассинхронного запроса по отражению todoLists
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some Error occurred'))
                    }
                }
                dispatch(setAppStatusAC('idle')) // окончание ассинхронного запроса по отражению todoLists - перестает показывать крутилку
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))// 15 старт ассинхронного запроса по отражению todoLists
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setAppStatusAC('succeeded'))// 15 старт ассинхронного запроса по отражению todoLists
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType = // список актионов, которые принимает этот редьюсер
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC> // 15 добавили тип нового "блокировочного" актиона
    | SetTodolistsActionType
    | SetAppStatusType // 15 добавил новый АС
    | SetAppErrorType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType // 15 добавили свойство тудулиста которое будем прменять для опередаления того, совершено ли какоето действие с этим объектом
}
