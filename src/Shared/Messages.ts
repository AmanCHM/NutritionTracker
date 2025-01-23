export const ERROR_MESSAGES = (...args: string[]) => ({
    REQUIRED: `This field is required ${args[0]}`,
    SOMETHING_WENT_WRONG: 'Sorry, something went wrong.',
    INVALID_OTP: 'Please enter a valid OTP.',
    UNAUTHORISED_ACCESS: 'Unauthorised access.',
  });
  
  export const SUCCESS_MESSAGES = (...args: string[]) => ({
    REQUIRED: `This field is required ${args[0]}`,
    OTP_SENT_TO_NUMBER_AND_EMAIL: 'OTP has been sent to your number and email.',
    PASSWORD_RESET_SUCCESSFULLY:
      'Password reset successfully. Please login to continue.',
    LOGGED_IN_SUCCESSFULLY: 'Logged in successfully.',
  });
  