"use client"
import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axiosInstance from '@/app/utilities/axiosInterceptors';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Field } from 'formik';
import { InputText } from 'primereact/inputtext';
function ListUsers() {
    const [users, setUsers] = useState([])
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [roles, setRoles] = useState([])

    useEffect(() => {
        fetchUsersFromDb();
        fetchRolesFromDb();
    }, [])

    const fetchRolesFromDb = () => {
        axiosInstance.get("Auth/get-roles").then(response => {
            setRoles(response.data);
        })
    }
    const fetchUsersFromDb = () => {
        axiosInstance.get("Auth/get-users").then(response => {
            setUsers(response.data);
        })
    }

    const rolesRowBody = (e) => {
        if (e.roles.length > 5) {
            return <Button size='small' severity='info' label='Göster'></Button>
        }
        let text = "";
        e.roles.forEach(role => text += "," + role);
        text = text.substring(1, text.length);
        return text;
    }


    const rolesEditor = (e) => {
        return <MultiSelect
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.value)}
            options={roles}
            optionLabel="name"
            optionValue='id'></MultiSelect>
    }

    const textEditor = (opt) => {
        return <InputText type="text" value={opt.value} onChange={(e) => { opt.editorCallback(e.target.value) }}></InputText>
    }

    const rowEditInit = (e) => {
        let role = e.data.roles;
        let dbRoles = roles.filter(i => role.includes(i.name));
        let dbRolesId = dbRoles.map((role) => {
            return role.id;
        })
        setSelectedRoles(dbRolesId);
    }

    const updateUser = (e) => {
        let request = { ...e.newData, roleIds: selectedRoles };
        console.log(request);
        axiosInstance.put("Auth", request).then(response => {
            fetchUsersFromDb();
        })
    }

    return (
        <DataTable editMode='row' onRowEditInit={rowEditInit} onRowEditComplete={(e) => updateUser(e)} value={users} tableStyle={{ minWidth: '50rem' }}>
            <Column field="id" header="ID"></Column>
            <Column editor={textEditor} field="firstName" header="First Name"></Column>
            <Column editor={textEditor} field="lastName" header="Last Name"></Column>
            <Column editor={textEditor} field="email" header="Email"></Column>
            <Column editor={rolesEditor} body={rolesRowBody} field="roles" header="Roller">
            </Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
    )
}

export default ListUsers