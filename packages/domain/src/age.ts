export function calcAge(birthDate: Date, today: Date): number {
  if (birthDate.getTime() > today.getTime()) {
    throw new RangeError('Birth date cannot be in the future');
  }

  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

  const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
  const birthdayNotYet =
    monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate());

  if (birthdayNotYet) age--;

  return age;
}