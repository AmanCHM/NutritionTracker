// import { IMAGES } from '../../../../Shared';  
import React from 'react';
function ErrorFallback() {
  return (
    <div>
      <img
        style={{
          width: 150,
          height: 150,
        }}
        // src={IMAGES.Attention}
        alt="error"
      />
      <p
        style={{
          fontWeight: 400,
        }}
      >
        Our website is currently experiencing technical issues. Rest assured, we
        are on it! Thank you for your patience.
      </p>
    </div>
  );
}

export default ErrorFallback;
