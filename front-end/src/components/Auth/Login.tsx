import { TextField, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import EventRegister from '../../api/EventRegister';
import AuthService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


    const login = () => {
        AuthService.login(email, pass);
    }

    const handleAuthEvent = (status: string, data: any) => {
        if (status === "login_failed") {
            if (Array.isArray(data?.data) && data?.data[0]?.dataPath === ".email") {
                return setMessage("Invalid email: " + data?.data[0]?.message);
            }

            if (Array.isArray(data?.data) && data?.data[0]?.dataPath === ".password") {
                return setMessage("Invalid password: " + data?.data[0]?.message);
            }

            if (!Array.isArray(data.data)) {
                return setMessage(data.data);
            }
        }

        if (status === "user_login" || status === "administrator_login") {
            setEmail("");
            setPass("");
            setIsLoggedIn(true);
        }
    }

    useEffect(() => {
        EventRegister.on("AUTH_EVENT", handleAuthEvent);

        return () => {
            EventRegister.off("AUTH_EVENT", handleAuthEvent);
        }
    }, [])

    if (isLoggedIn) return <Redirect to="/" />

    return (
        <div>
            <h1>{message}</h1>
            <form noValidate autoComplete="off">
                <TextField label="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
                <TextField label="Password" required value={pass} onChange={e => setPass(e.target.value)} type="password" />
                <Button variant="contained" color="primary" onClick={login}> Login </Button>
            </form>
        </div>
    )
}

export default Login
