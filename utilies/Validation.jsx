// validation email
export const isValidEmail = emailString => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailString)) {
      return true;
    }
    return false;
};
  
// validation password
export const isValidPassword = passwordString => {
  return passwordString.length >= 3;
};