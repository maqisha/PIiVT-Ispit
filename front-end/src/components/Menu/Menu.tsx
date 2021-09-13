import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/pizza">Menu</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/auth/logout">Logout</Link></li>
            </ul>
        </nav>
    )
}

export default Menu
