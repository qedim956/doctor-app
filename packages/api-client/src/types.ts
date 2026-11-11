export type Patient = {
  id: string;
  fullName: string;
  birthDate: string;
  sex: 'male' | 'female';
  age: number;
};