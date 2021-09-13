import AppConfig from '../config/app.config'
import axios, { AxiosResponse } from 'axios';
import EventRegister from './EventRegister';

type ApiMethod = 'get' | 'post' | 'put' | 'delete';
type ApiResponseStatus = 'ok' | 'error' | 'login';
type ApiRole = 'administrator' | 'user';
type TokenType = 'auth' | 'refresh';

interface ApiResponse {
    status: ApiResponseStatus,
    data: any,
}

export default function api(
    method: ApiMethod,
    path: string,
    role: ApiRole = 'user',
    body: any | undefined = undefined,
    doRefresh: boolean = true,
): Promise<ApiResponse | undefined> {
    return new Promise<ApiResponse | undefined>(resolve => {
        axios({
            method: method,
            baseURL: AppConfig.API_URL,
            url: path,
            data: body ? JSON.stringify(body) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken(role, "auth")}`
            }
        })
            .then(res => responseHandler(res, resolve))
            .catch(async error => {
                const errorStatusCode = error?.response.status;
                if (doRefresh && errorStatusCode === 401) {
                    const newToken: string | null = await refreshToken(role);
                    console.log("Requesting a refresh token . . .")
                    if (newToken === null) {
                        return resolve({
                            status: 'login',
                            data: null,
                        })
                    }

                    saveToken(role, "auth", newToken);

                    api(method, path, role, body, false)
                        .then(res => resolve(res))
                        .catch(error => {
                            EventRegister.emit("AUTH_EVENT", "force_login");
                            return resolve({
                                status: 'login',
                                data: null,
                            })
                        })
                    return;
                }

                if (errorStatusCode === 401) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                    return resolve({
                        status: 'login',
                        data: null,
                    })
                }

                if (errorStatusCode === 403) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                    return resolve({
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

function getToken(role: ApiRole, tokenType: TokenType): string {
    return localStorage.getItem(`${role}_${tokenType}_TOKEN`) ?? '';
}

export function saveToken(role: ApiRole, tokenType: TokenType, token: string): void {
    localStorage.setItem(`${role}_${tokenType}_TOKEN`, token);
}

function refreshToken(role: ApiRole): Promise<string | null> {
    return new Promise<string | null>(resolve => {
        axios({
            method: 'post',
            baseURL: AppConfig.API_URL,
            url: '/auth/refresh',
            data: JSON.stringify({
                refreshToken: getToken(role, "refresh"),
                role
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200) {
                    return resolve(null);
                }

                resolve(res.data?.authToken);
            })
            .catch(() => {
                resolve(null);
            })
    })
}