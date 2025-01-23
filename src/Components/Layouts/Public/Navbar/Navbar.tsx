import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";
// import Modal from "react-modal";
// import { loggedin, loggedout } from "../../Redux/logSlice";
import { RiAccountCircleFill } from "react-icons/ri";
// import LogoutModal from "../Modals/LogoutModal";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RootState } from "../../../../Store";
import { auth } from "../../../../Utils/firebase";
import { loggedout } from "../../../../Store/Auth";
import { ROUTES_CONFIG } from "../../../../Shared/Constants";


const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Type state.loggedReducer.logged as boolean from the Redux state
  const islogged = useSelector((state: RootState) => state.Auth.logged);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>();

  // const customStyles: Modal.Styles = {
  //   content: {
  //     top: "50%",
  //     left: "50%",
  //     right: "auto",
  //     bottom: "auto",
  //     marginRight: "-50%",
  //     transform: "translate(-50%, -50%)",
  //   },
  // };

  useEffect(() => {
    if (islogged) {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email || undefined);
      } else {
        setEmail(undefined);
      }
    }
  }, [islogged]);

  const handleLogout = () => {
    dispatch(loggedout());
    navigate(ROUTES_CONFIG.HOMEPAGE.path);
  };

  const handleLogin = () => {
    navigate(ROUTES_CONFIG.LOGIN.path);
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };

  // Add proper typing for NavLink's className function
  const classNameFunc = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "active_link" : "";

  return (
    <div>
      <nav className="navbar">
        <Link to={ROUTES_CONFIG.HOMEPAGE.path}>
          <div id="company-name">Nutrition Tracker</div>
        </Link>

        {islogged ? (
          <div className="navbar-login">
            <NavLink to={ROUTES_CONFIG.HOMEPAGE.path} className={classNameFunc}>
              Home
            </NavLink>
            <NavLink to={ROUTES_CONFIG.DASHBOARD.path} className={classNameFunc}>
              Dashboard
            </NavLink>
            <NavLink to={ROUTES_CONFIG.REPORTS.path} className={classNameFunc}>
              Reports
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CALORIE_CALCULATOR.path} className={classNameFunc}>
              BMR Calculator
            </NavLink>
            <NavLink to={ROUTES_CONFIG.ABOUT.path} className={classNameFunc}>
              About
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CONTACT.path} className={classNameFunc}>
              Contact
            </NavLink>
          </div>
        ) : (
          <div className="navbar-login">
            <NavLink to={ROUTES_CONFIG.HOMEPAGE.path} className={classNameFunc}>
              Home
            </NavLink>
            <NavLink to={ROUTES_CONFIG.ABOUT.path} className={classNameFunc}>
              About
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CONTACT.path} className={classNameFunc}>
              Contact
            </NavLink>
          </div>
        )}

        <div className="nav-button">
          {islogged ? (
            <div style={{ display: "flex", gap: "10px" }}>
              {email !== undefined ? email : ""}
              <RiAccountCircleFill size={40} onClick={handleModal} />
            </div>
          ) : (
            <span
              className="login-span"
              onClick={handleLogin}
              style={{ fontSize: "1.1rem" }}
            >
              Login
            </span>
          )}
        </div>

        {/* <Modal isOpen={isModalOpen} style={customStyles}>
          <LogoutModal
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              handleLogout();
              setIsModalOpen(false);
              toast.success("Logged out successfully");
            }}
          />
        </Modal> */}
      </nav>
    </div>
  );
};

export default Navbar;
