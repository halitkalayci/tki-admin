"use client"
import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axiosInstance from '@/app/utilities/axiosInterceptors';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Field } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Slider } from "primereact/slider"
import './carlist.css'
function ListUsers() {
    const [users, setUsers] = useState([])
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [roles, setRoles] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

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

    const filteredColumnBody = (e) => {
        return <div>*******</div>
    }

    const dateColumn = (e) => {
        return <div>{new Date().toISOString()}</div>
    }

    const statusBody = (e) => {
        if (e.status)
            return <i className="pi pi-check text-success"></i>
        return <i className="pi pi-times text-danger"></i>
    }

    const checkBoxEditor = (opt) => {
        return <Checkbox checked={opt.value} onChange={(e) => { opt.editorCallback(e.checked) }}></Checkbox>
    }

    const exportColumns = ["id", "firstName", "lastName", "email"].map((col) => {
        return { title: col, dataKey: col }
    });

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                console.log(users);
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, users);
                doc.save('users.pdf');
            })
        })
    }

    const headerBody = () => {
        return <div className='d-flex justify-content-between align-items-between'>
            <InputText placeholder='Search..' type="text" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}></InputText>
            <div className='buttons'>
                <Button onClick={exportPdf} severity='info' label='PDF'></Button>
                <Button severity='danger' label='Excel'></Button>
                <Button severity='success' label='CSV'></Button>
            </div>
        </div>
    }

    const dateFilter = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    }

    const rangeSelector = (options) => {
        return <>
            <Slider multiple={true} max={25} min={1} range value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            <div className="flex align-items-center justify-content-between px-2">
                <span>{options.value ? options.value[0] : 0}</span>
                <span>{options.value ? options.value[1] : 100}</span>
            </div>
        </>
    }

    // rowsPerPageOptions'ın ilk alanı = [5,10,20,30]
    // rows'a eşit olmalı
    return (
        <>{users.length > 0 && <DataTable rowsPerPageOptions={[5, 15, 20, 30, 100]} globalFilter={globalFilter} header={headerBody} globalFilterFields={["firstName", "lastName", "email", "roles"]} paginator rows={5} totalRecords={users.length} editMode='row' onRowEditInit={rowEditInit} onRowEditComplete={(e) => updateUser(e)} value={users} tableStyle={{ minWidth: '50rem' }}>
            <Column showFilterMenuOptions={false} sortable field="id" header="ID"></Column>
            <Column filter showFilterMatchModes={true} showFilterMenuOptions={true} showFilterOperator={false} sortable editor={textEditor} field="firstName" header="First Name"></Column>
            <Column filter showFilterOperator={false} editor={textEditor} field="lastName" header="Last Name"></Column>
            {/* <Column filterElement={dateFilter} filter filterField="date" dataType='date' body={dateColumn} field="date" header="Kayıt Tarihi"></Column> */}
            <Column filter editor={textEditor} field="email" header="Email"></Column>
            <Column editor={textEditor} field='password' body={filteredColumnBody} header="Password"></Column>
            <Column editor={checkBoxEditor} field='status' body={statusBody} header="Aktif"></Column>
            <Column filter editor={rolesEditor} body={rolesRowBody} field="roles" header="Roller">
            </Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>}
        </>
    )
}

export default ListUsers