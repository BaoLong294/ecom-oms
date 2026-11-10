import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePhone,
} from './validation';

const EMAIL_EMPTY = 'Please enter an email address.';
const EMAIL_INVALID = 'Please enter a valid email address.';
const PASSWORD_EMPTY = 'Please enter a password.';
const PASSWORD_INVALID = 'Please input valid password.';

describe('validateEmail', () => {
  it('returns the empty message for an empty string', () => {
    expect(validateEmail('')).toBe(EMAIL_EMPTY);
  });

  it('returns the empty message for whitespace only', () => {
    expect(validateEmail('   ')).toBe(EMAIL_EMPTY);
  });

  it('rejects an email without @', () => {
    expect(validateEmail('john.doe')).toBe(EMAIL_INVALID);
  });

  it('rejects an email without a top-level domain', () => {
    expect(validateEmail('john@gmail')).toBe(EMAIL_INVALID);
  });

  it('rejects a one-letter top-level domain', () => {
    expect(validateEmail('john@gmail.c')).toBe(EMAIL_INVALID);
  });

  it('accepts a dot in the local part', () => {
    expect(validateEmail('john.doe@gmail.com')).toBe('');
  });

  it('accepts a multi-level domain', () => {
    expect(validateEmail('a@b.co.uk')).toBe('');
  });

  it('ignores surrounding whitespace', () => {
    expect(validateEmail('  john@gmail.com  ')).toBe('');
  });
});

describe('validatePassword', () => {
  it('returns the empty message for an empty string', () => {
    expect(validatePassword('')).toBe(PASSWORD_EMPTY);
  });

  it('returns the empty message for whitespace only', () => {
    expect(validatePassword('   ')).toBe(PASSWORD_EMPTY);
  });

  it('rejects 7 characters', () => {
    expect(validatePassword('abc1234')).toBe(PASSWORD_INVALID);
  });

  it('accepts exactly 8 characters', () => {
    expect(validatePassword('abcd1234')).toBe('');
  });

  it('accepts exactly 20 characters', () => {
    expect(validatePassword('abcdefghij1234567890')).toBe('');
  });

  it('rejects 21 characters', () => {
    expect(validatePassword('abcdefghij12345678901')).toBe(PASSWORD_INVALID);
  });

  it('rejects a character outside the allowed set', () => {
    expect(validatePassword('abcd 1234')).toBe(PASSWORD_INVALID);
  });

  it('rejects a password without a digit', () => {
    expect(validatePassword('abcdefgh')).toBe(PASSWORD_INVALID);
  });

  it('rejects a password without a letter', () => {
    expect(validatePassword('12345678')).toBe(PASSWORD_INVALID);
  });

  it('accepts allowed symbols', () => {
    expect(validatePassword('abc123!#$%')).toBe('');
  });

  it('ignores surrounding whitespace', () => {
    expect(validatePassword('  abcd1234  ')).toBe('');
  });
});

describe('validateRequired', () => {
  it('asks for the field when the value is empty', () => {
    expect(validateRequired('', 'first name')).toBe(
      'Please enter your first name.'
    );
  });

  it('asks for the field when the value is only spaces', () => {
    expect(validateRequired('   ', 'first name')).toBe(
      'Please enter your first name.'
    );
  });

  it('uses the given field name in the message', () => {
    expect(validateRequired('', 'address details')).toBe(
      'Please enter your address details.'
    );
  });

  it('returns an empty string for a non-empty value', () => {
    expect(validateRequired('Long', 'first name')).toBe('');
  });
});

describe('validatePhone', () => {
  const EMPTY_PHONE_MESSAGE = 'Please enter your mobile phone number.';
  const INVALID_PHONE_MESSAGE = 'Please enter a valid mobile phone number.';

  it('asks for a phone number when the value is empty', () => {
    expect(validatePhone('')).toBe(EMPTY_PHONE_MESSAGE);
  });

  it('asks for a phone number when the value is only spaces', () => {
    expect(validatePhone('   ')).toBe(EMPTY_PHONE_MESSAGE);
  });

  it('accepts 10 digits starting with 0', () => {
    expect(validatePhone('0912345678')).toBe('');
  });

  it('ignores spaces around the number', () => {
    expect(validatePhone('  0912345678  ')).toBe('');
  });

  it('rejects 9 digits', () => {
    expect(validatePhone('091234567')).toBe(INVALID_PHONE_MESSAGE);
  });

  it('rejects 11 digits', () => {
    expect(validatePhone('09123456789')).toBe(INVALID_PHONE_MESSAGE);
  });

  it('rejects a number not starting with 0', () => {
    expect(validatePhone('1912345678')).toBe(INVALID_PHONE_MESSAGE);
  });

  it('rejects a number containing a letter', () => {
    expect(validatePhone('09123a5678')).toBe(INVALID_PHONE_MESSAGE);
  });
});
