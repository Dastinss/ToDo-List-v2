// 15 добавил информирование об ошибке с сервера: польностью все из https://mui.com/material-ui/react-snackbar/#customized-snackbars
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "../../app/store";
import {RequestStatusType, setAppErrorAC} from "../../app/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackbar = () => {
    const dispatch = useAppDispatch()
    // const [open, setOpen] = React.useState(false); // 15 закоментили перед тем, как сделаем компоненту ErrorSnacbar  зависимой от стейта, т.е выводим ошибку на экран в зависисомтси от того, что пришлет нам стейт
    const error = useAppSelector<null | string>((state) => state.app.error)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => { //обработчик события дергается в момент закрітия сайд бара
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC(null))
        // setOpen(false);
    };

    return ( // разметка jsx
        // <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}> // 15 закоментили перед тем, как сделаем компоненту ErrorSnacbar  зависимой от стейта, т.е выводим ошибку на экран в зависисомтси от того, что пришлет нам стейт
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
            {/*<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}> // 15 закоментили перед тем, как сделаем компоненту ErrorSnacbar  зависимой от стейта, т.е выводим ошибку на экран в зависисомтси от того, что пришлет нам стейт */}
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {/*This is a success message!*/}
                {error}
            </Alert>
        </Snackbar>
    );
}
