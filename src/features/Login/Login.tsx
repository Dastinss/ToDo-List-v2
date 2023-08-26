// 16 польностью скопировал с задания к уроку

import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {loginTC} from "./auth-reducer";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../app/store";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector<AppRootStateType>(state => state.auth.isLoggedIn)

    const formik = useFormik({ // 16 добавиили строки из сайта формик https://formik.org/docs/tutorial
        initialValues: { // ключ зарезервированный внутри хука , это дефолтное состояние ,которое будет внутри себя хранить value
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'Password should be more than 3 symbols';
            }
            return errors;
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2)); // 16 законектили "тренировочный алерт", и делаем запрос на сервер в виде санки ниже (с редюсера)
            dispatch(loginTC(values)) // 16 добавили санку вместо тренировочного алерта
            formik.resetForm() // 16 после того как мы нажали enter и попали в onsubmit зачистим значения введенные в поля
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label='Email'
                            margin="normal"
                            // name='email' // 16 заменил на ОДНУ строчку с диструктуризацией
                            // onChange={formik.handleChange} // 16 заменил на ОДНУ строчку с диструктуризацией
                            // onBlur={formik.handleBlur} // 16 заменил на ОДНУ строчку с диструктуризацией
                            // value={formik.values.email} // 16 заменил на ОДНУ строчку с диструктуризацией
                            {...formik.getFieldProps('email')} // 16 заменил ОДНОЙ строчкой с диструктуризацией все выше закоменченное - ОСОБЕННОСТЬ formik.getFieldProps
                        />

                        {formik.touched.email && formik.errors.email ?
                            <div style={{color: 'red'}}>{formik.errors.email}</div> : null}

                        <TextField
                            type='password'
                            label='Password'
                            margin='normal'
                            // name='password'
                            // onChange={formik.handleChange}
                            // onBlur={formik.handleBlur}
                            // value={formik.values.password}
                            {...formik.getFieldProps('password')} // 16 заменил ОДНОЙ строчкой с диструктуризацией все выше закоменченное - ОСОБЕННОСТЬ formik.getFieldProps
                        />

                        {formik.touched.password && formik.errors.password ?
                            <div style={{color: 'red'}}>{formik.errors.password}</div> : null}

                        <FormControlLabel
                            label={'Remember me'}
                            control={
                                <Checkbox
                                    checked={formik.values.rememberMe} // 16 после того как мы нажали enter и попали в onsubmit, зачистим галочку в чек боксе remember Me
                                    // name={'rememberMe'}
                                    // onChange={formik.handleChange}
                                    {...formik.getFieldProps('rememberMe')} // 16 заменил ОДНОЙ строчкой с диструктуризацией все выше закоменченное - ОСОБЕННОСТЬ formik.getFieldProps
                                />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </form>
                </FormGroup>
            </FormControl>
        </Grid>
    </Grid>
}
