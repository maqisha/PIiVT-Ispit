import AppConfig from '../config/app.config'
import axios, { AxiosResponse } from 'axios';
import EventRegister from './EventRegister';

type ApiMethod = 'get' | 'post' | 'put' | 'delete';
type ApiResponseStatus = 'ok' | 'error';
type ApiRole = 'administrator' | 'user';
type TokenType = 'auth' | 'refresh';

interface ApiResponse {
    status: ApiResponseStatus,
    data: any,
}

export default function api(
    method: ApiMethod,
    path: string,
    body: any | undefined = undefined,
    doRefresh: boolean = true,
): Promise<ApiResponse> {
    return new Promise<ApiResponse>(resolve => {
        axios({
            method: method,
            baseURL: AppConfig.API_URL,
            url: path,
            data: body ? JSON.stringify(body) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken("auth")}`
            }
        })
            .then(res => {
                resolve({
                    status: 'ok',
                    data: res.data,
                })
            })
            .catch(async error => {
                if (!error?.response) return resolve({
                    status: 'error',
                    data: error
                })

                const errorStatusCode = error?.response.status;

                if (doRefresh && errorStatusCode === 401) {
                    const newToken: string | null = await refreshToken(localStorage.getItem('role') as ApiRole);

                    if (newToken === null) return resolve({ status: 'error', data: null, })

                    saveToken("auth", newToken);

                    api(method, path, body, false)
                        .then(res => resolve(res))
                        .catch(error => {
                            EventRegister.emit("AUTH_EVENT", "force_login");
                        })

                    return;
                }

                if (errorStatusCode === 401) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                }

                if (errorStatusCode === 403) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                }

                resolve({
                    status: 'error',
                    data: error?.response,
                })
            })
    })
}

export function apiAsForm(
    method: ApiMethod,
    path: string,
    body: FormData,
    doRefresh: boolean = true,
): Promise<ApiResponse> {
    return new Promise<ApiResponse>(resolve => {
        axios({
            method: method,
            baseURL: AppConfig.API_URL,
            url: path,
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken('auth'),
            },
        })
            .then(res => {
                resolve({
                    status: 'ok',
                    data: res.data,
                });
            })
            .catch(async error => {
                if (!error?.response) return resolve({
                    status: 'error',
                    data: error
                })

                const errorStatusCode = error?.response.status;

                if (doRefresh && errorStatusCode === 401) {
                    const newToken: string | null = await refreshToken(localStorage.getItem('role') as ApiRole);

                    if (newToken === null) {
                        return resolve({
                            status: 'error',
                            data: null,
                        });
                    }

                    saveToken('auth', newToken);

                    apiAsForm(method, path, body, false)
                        .then(res => resolve(res))
                        .catch(() => { EventRegister.emit("AUTH_EVENT", "force_login"); });

                    return;
                }

                if (errorStatusCode === 401) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                }

                if (errorStatusCode === 403) {
                    EventRegister.emit("AUTH_EVENT", "force_login");
                }

                resolve({
                    status: 'error',
                    data: error?.response,
                })
            });
    });
}

function refreshToken(role: ApiRole): Promise<string | null> {
    return new Promise<string | null>(resolve => {
        axios({
            method: 'post',
            baseURL: AppConfig.API_URL,
            url: '/auth/refresh',
            data: JSON.stringify({
                refreshToken: getToken("refresh"),
                role
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => resolve(res.data?.authToken))
            .catch(() => resolve(null))
    })
}

export function getToken(tokenType: TokenType): string {
    return localStorage.getItem(`${tokenType}_TOKEN`) ?? '';
}

export function saveToken(tokenType: TokenType, token: string): void {
    localStorage.setItem(`${tokenType}_TOKEN`, token);
}
