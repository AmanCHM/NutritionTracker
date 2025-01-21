export const FORM_VALIDATION_MESSAGES = (...args: string[]) => ({
    REQUIRED: 'This is required.',
    MIN_LENGTH: `This input required minimum (${args[0]}) character`,
    MAX_LENGTH: `This input exceeded maxLength (${args[0]})`,
    VALID_EMAIL: 'Please enter the valid email',
    VALID_PASSWORD:
      'Password must contain atleast 8 characters including one uppercase, one lowercase, one number and one special character.',
    VALID_USERNAME:
      'Use a username between 5 to 18 lowercase alphanumeric characters, special characters and spaces are not allowed.',
    CONFIRM_PASSWORD: 'Your passwords do not match',
    VIDEO_NAME:
      'Use a filename between 5 to 18 alphanumeric characters, special characters are not allowed.',
    VALID_LINK: 'Please enter valid link.',
    ANSWER_REQUIRED: 'Please add your answer to join this squad',
    LONDER_ANSWER_REQUIRED: 'Please provide a longer answer',
    MAX_NUMBER: `Maximum value should be less than (${args[0]})`,
  });
  
  export const VALIDATION_REGEX = {
    EMAIL: /^\S+@\S+\.\S+$/, // Validates basic email structure
    NUMBER: /\d+/g, // Matches any sequence of digits
    SPECIAL_CHARACTERS_NOT_ALLOWED: /^[a-zA-Z0-9\s]+$/, // Allows only alphanumeric characters and spaces
    SPECIAL_CHARACTERS_AND_SPACES_NOT_ALLOWED: /^[a-zA-Z0-9]+$/, // Allows only alphanumeric characters
    // VALID_LINK: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/,
    USERNAME: /^[a-z0-9]+$/, // Allows only lowercase letters and digits
    PASSWORD:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };
  