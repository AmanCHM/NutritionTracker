import { ROUTES_CONFIG } from '../../../../Shared/Constants';
import './navbar.scss';
import { Link } from 'react-router-dom';


export function Navbar() {
  return (
    <header className="header d-flex" id="header">
      <Link to={ROUTES_CONFIG.HOMEPAGE}>Home page</Link>
      <Link to={ROUTES.LOGIN}>Login</Link>
    </header>
  );
}

export default Navbar;