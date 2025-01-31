import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";
import { RiAccountCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RootState } from "../../../../Store";
import { auth } from "../../../../Utils/firebase";
import { loggedout } from "../../../../Store/Auth";
import { ROUTES_CONFIG } from "../../../../Shared/Constants";
import CustomModal from "../../../Shared/CustomModal/CustomModal";
import LogoutModal from "./Modal/LogoutModal";


const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Type state.loggedReducer.logged as boolean from the Redux state
  const islogged = useSelector((state: RootState) => state.Auth.logged);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>();

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

        <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LogoutModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleLogout();
            setIsModalOpen(false);
          }}
        />
      </CustomModal>
      </nav>
    </div>
  );
};

export default Navbar;
