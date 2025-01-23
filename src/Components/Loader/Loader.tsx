import React from "react";
import { useSelector } from "react-redux";

import "./Loader.css";
import { RootState } from "../../Store";

const Loader: React.FC = () => {
  const loading = useSelector((state: RootState) => state.Loader.loading);  

  if (!loading) return null;

  return <div className="loading"></div>;
};

export default Loader;
