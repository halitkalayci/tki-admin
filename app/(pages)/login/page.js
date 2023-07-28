"use client"
import { LayoutContext } from '@/app/contexts/LayoutContext'
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import Head from 'next/head';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
function Login() {
    // Destructring
    const { layoutConfig, setShowLayout } = useContext(LayoutContext);
    //const layoutContext = useContext(LayoutContext);

    useEffect(() => {
        setShowLayout(false);
    })

    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required()
    })
    const login = (values) => {
        console.log(values);
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <Formik onSubmit={(e) => { login(e) }} initialValues={initialValues}>
                            <Form>
                                <div>
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <Field name="email" inputid="email1" type="text" placeholder="Email address" className="p-inputtext p-component w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Password
                                    </label>
                                    <Field name="password" inputid="password1" placeholder="Password" toggleMask className="p-inputtext p-component w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Field>

                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">Remember me</label>
                                        </div>
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Button label="Sign In" className="w-full p-3 text-xl" type="submit"></Button>
                                </div>
                            </Form>
                        </Formik>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login
