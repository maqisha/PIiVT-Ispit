import AppConfig from '../config/app.config'
import axios, { AxiosResponse } from 'axios';

type ApiMethod = 'get' | 'post' | 'put' | 'delete';
type ApiResponseStatus = 'ok' | 'error' | 'login';

interface ApiResponse {
    status: ApiResponseStatus,
    data: any,
}

export default function api(
    method: ApiMethod,
    path: string,
    body: any | undefined = undefined
): Promise<ApiResponse | undefined> {
    return new Promise<ApiResponse | undefined>(resolve => {
        axios({
            method: method,
            baseURL: AppConfig.API_URL,
            url: path,
            data: body ? JSON.stringify(body) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorisation': 'Bearer NO-TOKEN'
            }
        })
            .then(result => responseHandler(result, resolve))
            .catch(error => {
                if (error?.response?.status === 401) {
                    resolve({
                        status: 'login',
                        data: null,
                    })
                }

                if (error?.response?.status === 403) {
                    resolve({
                        status: 'login',
                        data: "Unauthorized",
                    })
                }

                resolve({
                    status: 'error',
                    data: '' + error?.response,
                })
            })
    })
}

function responseHandler(res: AxiosResponse, resolve: (data?: ApiResponse) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: '' + res,
        })
    }

    resolve({
        status: 'ok',
        data: res.data,
    })
}