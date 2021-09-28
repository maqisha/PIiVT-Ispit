import { TextField, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import EventRegister from '../../api/EventRegister';
import AuthService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';
import './Auth.scss';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [name, setName] = useState<string>("");

    const [message, setMessage] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [isRegister, setIsRegister] = useState<boolean>(false);


    const login = () => {
        AuthService.login(email, pass);
    }

    const register = () => {
        AuthService.register(email, pass, name, address, phone);
    }

    const handleAuthEvent = (status: string, data: any) => {
        if (status === "login_failed" || status =="register_failed") {
            if (Array.isArray(data?.data) && data?.data[0]?.dataPath.substring(0,1) === ".") {
                const property = data?.data[0]?.dataPath.substring(1);
                return setMessage(`Invalid ${property}`);
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
        <div className="auth">
            <h3>{message}</h3>
            {
                !isRegister ?
                    <form noValidate autoComplete="off">
                        <TextField className="input" label="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField className="input" label="Password" required value={pass} onChange={e => setPass(e.target.value)} type="password" />
                        <Button variant="contained" color="primary" onClick={login} disabled={pass.length < 6}> Login </Button>
                    </form>
                    :
                    <form noValidate autoComplete="off">
                        <TextField className="input" label="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField className="input" label="Password" required value={pass} onChange={e => setPass(e.target.value)} type="password" />
                        <TextField className="input" label="Name" required value={name} onChange={e => setName(e.target.value)} />
                        <TextField className="input" label="Address" required value={address} onChange={e => setAddress(e.target.value)} />
                        <TextField className="input" label="Phone" required value={phone} onChange={e => setPhone(e.target.value)} />
                        <Button variant="contained" color="primary" onClick={register} disabled={pass.length < 6}> Register </Button>
                    </form>
            }

            <a onClick={()=>setIsRegister(!isRegister)}>Don't have an account yet? Click here to register!</a>



        </div>
    )
}

export default Login
