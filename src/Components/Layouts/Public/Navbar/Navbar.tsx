import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RootState } from "../../../../Store";
import { auth } from "../../../../Utils/firebase";
import { loggedout } from "../../../../Store/Auth";
import { ROUTES_CONFIG } from "../../../../Shared/Constants";
import CustomModal from "../../../Shared/CustomModal/CustomModal";
import LogoutModal from "./Modal/LogoutModal";
import { LABEL } from "../../../../Shared";


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
          <div id="company-name">{LABEL.APP_TITLE}</div>
        </Link>

        {islogged ? (
          <div className="navbar-login">
            <NavLink to={ROUTES_CONFIG.HOMEPAGE.path} className={classNameFunc}>
              {ROUTES_CONFIG.HOMEPAGE.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.DASHBOARD.path} className={classNameFunc}>
             {ROUTES_CONFIG.DASHBOARD.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.REPORTS.path} className={classNameFunc}>
             {ROUTES_CONFIG.REPORTS.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CALORIE_CALCULATOR.path} className={classNameFunc}>
             {ROUTES_CONFIG.CALORIE_CALCULATOR.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.ABOUT.path} className={classNameFunc}>
             {ROUTES_CONFIG.ABOUT.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CONTACT.path} className={classNameFunc}>
             {ROUTES_CONFIG.CONTACT.title}
            </NavLink>
          </div>
        ) : (
          <div className="navbar-login">
            <NavLink to={ROUTES_CONFIG.HOMEPAGE.path} className={classNameFunc}>
            {ROUTES_CONFIG.HOMEPAGE.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.ABOUT.path} className={classNameFunc}>
            {ROUTES_CONFIG.ABOUT.title}
            </NavLink>
            <NavLink to={ROUTES_CONFIG.CONTACT.path} className={classNameFunc}>
            {ROUTES_CONFIG.CONTACT.title}
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
             {LABEL.LOG_IN}
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
