declare type RegisterRequestBody = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  lastname: string;
  firstname: string;
  nationalityCountryId: number;
  birthdate: Date;
  address: string;
  postalCode: string;
  addressCountryId: number;
  phone: string;
};
