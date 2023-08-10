import crypto from 'crypto'
import { broadcastCode } from './socket.service';

const generateCode = () => (
  crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()
);

let code = generateCode();

const isValid = (input: string) => code.toUpperCase() === input.toUpperCase();

export const validate = (code: string) => {
  if (!isValid(code))
    return false;

  setCode(generateCode());
  broadcastCode();
  return true;
};

export const getCode = () => code;
const setCode = (newCode: string) => code = newCode;