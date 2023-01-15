export const toPhoneNumber = (phoneNumber: string | number): number => {
  return +String(phoneNumber).replace(/\D/g, "");
};
