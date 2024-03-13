export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCellPhone = (value: number) => {
  if (!value) {
    return true;
  }
  return /^69\d{8}$/.test(value.toString());
};

export const validateTelephone = (value: number | string) => {
  if (!value) {
    return true;
  }
  return /^[0-9]{10}$/.test(value.toString());
};
