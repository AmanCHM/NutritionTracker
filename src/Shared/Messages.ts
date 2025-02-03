export const ERROR_MESSAGES = (...args: string[]) => ({
    REQUIRED: `This field is required ${args[0]}`,
    SOMETHING_WENT_WRONG: 'Sorry, something went wrong.',
    INVALID_OTP: 'Please enter a valid OTP.',
    UNAUTHORISED_ACCESS: 'Unauthorised access.',
    INVALID_EMAIL: 'Invalid email address',
    GOOGLE_SIGNEDUP_FAIL:'Google Sign-Up Failed',
    GOOGLE_LOGIN_FAILED:'Google Login failed',
    EMAIL_NOT_REGISTERED:'Email not registered',
    ERROR_SAVING_DATA:'Failed to save  data.',
    USER_NOT_AUTHENTICATED:'User not authenticated. Please log in.',
    CALORIE_NOT_SAVED:'No calorie data to save. Please calculate first',
    ERROR_FETCH: 'Error fetching data',
    FAILED_DRINK_ADD:'Failed to add drink details.',
    UPDATE_FAILED:"Failed to update drink details.",
    UPLOAD_FOOD_IMAGE:'Please upload a valid food image',
    NOT_FOUND:"No data found for the specified drink type.",
    ITEM_NOT_DELETED:'Item not Deleted',
    MEAL_NOT_FOUND:'Meal data not found',
    NOT_DEFINED:'Item not defined',
    SELECT_ACTIVITY_LEVEL:"Please select an activity level!"
  });
  
  export const SUCCESS_MESSAGES = (...args: string[]) => ({
    REQUIRED: `This field is required ${args[0]}`,
    PASSWORD_RESET_SUCCESSFULLY:
      'Password reset successfully. Please login to continue.',
    EMAIL_SENT:'Email sent',
    LOGGED_IN_SUCCESSFULLY: 'Logged in successfully.',
    LOGGED_IN_UNSUCCESS:'Login not successful',
    SIGNED_UP_SUCCESSFULLY:'SignedUp Successfully',
    SIGNED_UP_NOT_SUCCESSFULLY:'SignUp not successful',
    GOOGLE_SIGNEDUP_SUCCESS: 'Google Sign-Up Successful',
    GOOGLE_LOGIN_SUCCESS:'Google Logged in successful',
    CALORIE_SAVED_SUCCESSFULLY:'Calorie data saved successfully.',
    SET_CALORIE:'Your calorie is set',
    SUCCESS_ITEM_DELETED:'Successfully item deleted',
    SUCCESS_ITEM_ADD:'Successfully item added',
    SUCCESS_DRINK_ADDED:'Drink details added successfully!',
    ITEM_EDIT_SUCCESS:'Item edited successfully'

  });
  