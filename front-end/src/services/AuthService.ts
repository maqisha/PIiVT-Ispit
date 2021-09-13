import api, { saveToken } from "../api/api";
import EventRegister from "../api/EventRegister";

export default class AuthService {
    public static login(email: string, password: string) {
        api(
            'post',
            '/auth/login',
            { email, password },
            false
        )
            .then(res => {
                if (res.status === "ok") {
                    const authToken = res.data?.authToken ?? "";
                    const refreshToken = res.data?.refreshToken ?? "";
                    const role = res.data?.role;

                    saveToken('auth', authToken);
                    saveToken('refresh', refreshToken);
                    localStorage.setItem('role', role);

                    EventRegister.emit("AUTH_EVENT", `${role}_login`);
                } else {
                    EventRegister.emit("AUTH_EVENT", `login_failed`, res.data);
                }
            })
            .catch(error => {
                EventRegister.emit("AUTH_EVENT", "login_failed", error);
            })
    }

    public static register(email: string, password: string, name: string, address: string, phoneNumber: string) {
        api(
            'post',
            '/auth/register',
            { email, password, name, address, phoneNumber },
            false
        )
            .then(res => {
                console.log(res);
                if (res.status === "ok")
                    AuthService.login(email, password);

                EventRegister.emit("AUTH_EVENT", "register_failed", res.data);   
            })
            .catch(error => {
                EventRegister.emit("AUTH_EVENT", "register_failed", error);
            })
    }
}