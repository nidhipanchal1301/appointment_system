import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Login</Link> |
      <Link to="/register">Register</Link> |
      <Link to="/providers">Providers</Link> |
      <Link to="/book">Book</Link> |
      <Link to="/appointments">Appointments</Link>
    </nav>
  );
}

export default Navbar;