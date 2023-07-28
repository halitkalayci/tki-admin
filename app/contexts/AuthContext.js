'use client';
import { createContext, useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Toast } from 'primereact/toast';
import { ClaimNames } from '../constants/claimNames';

export const AuthContext = createContext(); // => DEPO OLUŞTUR

// Provide => Dışarıya sağlamamız (sağlayıcı)

// RFC => React Functional component
export const AuthProvider = (props) => {
    const toast = useRef(null);

    const getInitialAuthState = () => {
        if (typeof window !== 'undefined' && localStorage.getItem('token') != null) return true;

        return false;
    };

    const showToastr = (opt) => {
        toast.current.clear();
        toast.current.show(opt);
    };

    // add one more function - showToastrHtml
    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());

    const getDecodedToken = () => {
        if (getInitialAuthState() == false) return {};
        let obj = {};
        try {
            obj = jwt_decode(localStorage.getItem('token'));
        } catch (error) {
            obj = {};
        }
        return obj;
    };

    const isAuthorized = (roles) => {
        let hasRole = false;
        let token = getDecodedToken();
        let userRoles = token[ClaimNames.ROLES];
        if (userRoles) {
            roles.forEach((role) => {
                if (userRoles.includes(role)) hasRole = true;
            });
        }
        return hasRole;
    };

    return (
        <AuthContext.Provider value={{ isAuthorized, isAuthenticated, setIsAuthenticated, getDecodedToken, showToastr }}>
            <Toast ref={toast} />
            {props.children}
        </AuthContext.Provider>
    );
};
//FileUpload, SelectBox
// SignalR => Canlı veri akışı
