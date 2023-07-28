import axios from 'axios';
import { ErrorTypes } from '../constants/errorTypes';
import jwt_decode from 'jwt-decode';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:5210/api/',
    withCredentials: true
});

// Her request öncesi token süresini kontrol edip, süresi geçen
// token varsa yenileyip requesti öyle göndermek.

axiosInstance.interceptors.request.use((config) => {
    window.dispatchEvent(new Event("requestStart"))
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        window.dispatchEvent(new Event("requestEnd"))
        console.log('Cevap alındı.');
        //
        return response;
    },
    async (error) => {
        window.dispatchEvent(new Event("requestEnd"))
        // Hata bir business error mu? => toastr error.detail
        // Backenddeki hata kalıplarını karşılayacak kodlar

        let type = error.response.data.type;

        // React Componenti değil
        // React Componentlerinde kullanılabilen işlevler ve saf javascript

        // Toastr'i global hale getirmek.
        // Context
        // Context => React Hook
        // Saf javascript => Context
        switch (type) {
            // never use magic string
            case ErrorTypes.BUSINESS_ERROR:
                window.dispatchEvent(new CustomEvent('toastr', { detail: { severity: 'error', summary: 'HATA', detail: error.response.data.detail } }));
                break;
            case ErrorTypes.VALIDATION_ERROR:
                // Tüm errorları foreach ile gezip ekrana yazdırmak.
                // Gelen veriyi iyi analiz edip ön tarafta UX açısından en verimli nasıl kullanabiliriz.
                let message = '';
                error.response.data.Errors.forEach((totalError) => {
                    totalError.Errors.forEach((err) => {
                        message += err + '\n';
                    });
                });
                window.dispatchEvent(new CustomEvent('toastr', { detail: { severity: 'error', summary: 'HATA', detail: message } }));
                break;
            case ErrorTypes.AUTHORIZATION_ERROR:
                // Kullanıcının tokeni var ama süresi geçmiş.
                // Refresh-Token
                // localStorage.token varsa Refresh
                // yetkiniz yok
                // windowEvent => react'e erişim yok ama ihtiyaç var
                // window.dispatchEvent(new CustomEvent("toastr", { detail: { severity: 'error', summary: 'HATA', detail: "Yetkiniz bulunmamaktadır." } }));
                // window.dispatchEvent(new Event("redirectToLogin"))
                // sonsuz döngü? => Kullanıcı gerçekten refresh etmeli.

                // tokenin süresi geçmiş mi? => geçmemişse "Yetki yetersiz." ❌❌
                // token olmadığı => hiç login olmamış olması ❌❌
                // token var, süresi geçmiş, yenilediğim halde 401 => ❌❌
                // token var, süresi geçmiş, yapılmak istenen işleme yetki var => ✔️
                debugger;
                let token = localStorage.getItem('token');
                if (!token) {
                    window.dispatchEvent(new Event('redirectToLogin'));
                    break;
                }
                let decodedToken = jwt_decode(token);
                if (Date.now() >= decodedToken['exp'] * 1000) {
                    const originalRequest = error.config;
                    originalRequest._retry = true; // axios'a isteği tekrar denemesi
                    let response = await axiosInstance.post('Auth/refresh-token');
                    let token = response.data.token;
                    localStorage.setItem('token', token); // localStorage
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }
                window.dispatchEvent(new CustomEvent('toastr', { detail: { severity: 'error', summary: 'HATA', detail: 'Yetkiniz bulunmamaktadır.' } }));
                //window.dispatchEvent(new Event("redirectToLogin"))
                break;
            default:
                alert('Bilinmedik Hata');
                break;
        }

        console.log(error);
        return Promise.reject(error);
    }
);

export default axiosInstance;

// tki-react.vercel.app/location
