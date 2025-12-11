/**
 * Validates a Spanish DNI or NIE.
 */
export const validateDNI = (value: string): boolean => {
  const validChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  const nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  
  const str = value.toUpperCase().trim();

  if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

  const niePrefix = str.charAt(0);
  let nieValue = str;
  
  if (niePrefix === 'X') nieValue = '0' + str.substr(1);
  if (niePrefix === 'Y') nieValue = '1' + str.substr(1);
  if (niePrefix === 'Z') nieValue = '2' + str.substr(1);

  const letter = str.charAt(str.length - 1);
  const charIndex = parseInt(nieValue.substr(0, 8)) % 23;

  return validChars.charAt(charIndex) === letter;
};

/**
 * Validates an IBAN.
 */
export const validateIBAN = (iban: string): boolean => {
  const CODE_LENGTHS: { [key: string]: number } = {
    ES: 24, // Spain
  };
  
  const ibantrim = iban.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const code = ibantrim.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
  
  if (!code || ibantrim.length !== (CODE_LENGTHS[code[1]] || 24)) return false;

  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) => {
    return (letter.charCodeAt(0) - 55).toString();
  });

  return mod97(digits) === 1;
};

const mod97 = (string: string): number => {
  let checksum = string.slice(0, 2);
  let fragment;
  for (let offset = 2; offset < string.length; offset += 7) {
    fragment = checksum + string.substring(offset, offset + 7);
    checksum = (parseInt(fragment, 10) % 97).toString();
  }
  return parseInt(checksum, 10);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Accepts standard Spanish mobile/landline formats, allowing spaces
  return /^(\+34|0034|34)?[6789]\d{8}$/.test(phone.replace(/\s+/g, ''));
};