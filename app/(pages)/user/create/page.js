"use client"
import { InputText } from 'primereact/inputtext'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import axiosInstance from '@/app/utilities/axiosInterceptors';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup"
import { AuthContext } from '@/app/contexts/AuthContext';
function CreateUser() {
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [roles, setRoles] = useState([])
    const authContext = useContext(AuthContext);
    useEffect(() => {
        fetchRolesFromDb();
    }, [])

    const fetchRolesFromDb = () => {
        axiosInstance.get("Auth/get-roles").then(response => {
            setRoles(response.data);
        })
    }


    const initialValues =
    {
        firstName: "",
        lastName: "",
        password: "",
        passwordConfirm: "",
        email: "",
        ipAddress: "",
    }

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required().min(2),
        lastName: Yup.string().required(),
        password: Yup.string().required(),
        passwordConfirm: Yup.string().required(),
        email: Yup.string().required()
    });

    const formSubmit = (values) => {
        let request = { ...values, roleIds: selectedRoles };
        axiosInstance.post("Auth/register", request).then(response => {
            authContext.showToastr({ severity: 'success', detail: 'Kullanıcı başarıyla oluşturuldu' });
        })
    }

    return (
        <div className='grid'>
            <div className="col-12">
                <div className="card">
                    <h5>Yeni Kullanıcı Ekle</h5>
                    <Formik onSubmit={(e) => formSubmit(e)} initialValues={initialValues} validationSchema={validationSchema}>
                        <Form>
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="firstname">Firstname</label>
                                    <Field className="p-inputtext p-component" name="firstName" id="firstname" type="text" />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="lastname">Lastname</label>
                                    <Field className="p-inputtext p-component" name="lastName" id="lastname" type="text" />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="password">Password</label>
                                    <Field className="p-inputtext p-component" name="password" id="password" rows="4" />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="passwordConfirm">Password Confirm</label>
                                    <Field className="p-inputtext p-component" name="passwordConfirm" id="passwordConfirm" type="text" />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="email">Email</label>
                                    <Field className="p-inputtext p-component" name="email" id="email" type="text" />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="state">Roller</label>
                                    <MultiSelect value={selectedRoles} onChange={(e) => setSelectedRoles(e.value)} options={roles} optionLabel="name" optionValue='id'
                                        placeholder="Select Roles" maxSelectedLabels={3} className="w-full" />
                                </div>
                                <div className='col-12 md:col-6'>
                                    <Button type="button" severity='danger' label='Vazgeç' ></Button>
                                </div>
                                <div className='col-12 md:col-6'>
                                    <Button type="submit" severity='info' label='Kaydet' ></Button>
                                </div>

                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
            <div className='col-12'>

            </div>
        </div>
    )
}

export default CreateUser
