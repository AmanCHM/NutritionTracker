import React from "react";
import { LABEL } from "../../../../Shared";

const ErrorFallback: React.FC = () => {
  return (
    <div>
      <img
        style={{
          width: 150,
          height: 150,
        }}
        alt="error"
      />
      <p
        style={{
          fontWeight: 400,
        }}
      >
       {LABEL.FALLBACK_LABEL}
      </p>
    </div>
  );
};

export default ErrorFallback;
