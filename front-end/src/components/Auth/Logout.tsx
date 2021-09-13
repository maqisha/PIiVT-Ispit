import { useEffect, useState } from "react"
import { saveToken } from '../../api/api';
import EventRegister from "../../api/EventRegister";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    const [loggedOut, setLoggedOut] = useState<boolean>(false);
    useEffect(() => {
        saveToken("auth", "");
        saveToken("refresh", "");
        localStorage.setItem('role', "");
        setLoggedOut(true);
        EventRegister.emit("AUTH_EVENT", "user_logout");
    }, [])

    if (loggedOut) {
        return (
            <Redirect to="/auth/login" />
        );
    }

    return (
        <CircularProgress />
    )
}

export default Logout
