import React, { useState } from "react";
import EmailVerificationModal from "./Modal/EmailVerificationModal";


const EmailVerificationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <EmailVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EmailVerificationPage;
