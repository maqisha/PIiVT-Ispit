import { Link } from "react-router-dom";

interface MenuProperties {
    authorizedRole: string;
}


const Menu = (props: MenuProperties) => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {
                    props.authorizedRole !== 'visitor' ?
                        <li><Link to="/pizza">Menu</Link></li> : ""
                }

                {
                    props.authorizedRole === 'visitor' ?
                        <li><Link to="/auth/login">Login</Link></li> :
                        <li><Link to="/auth/logout">Logout</Link></li>
                }

            </ul>
        </nav>
    )
}

export default Menu
