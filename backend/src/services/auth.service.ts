import jwt from 'jsonwebtoken'

const {
  JWT_SECRET_KEY,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} = process.env

export const expiresIn = 1000 * 60 * 60 * 24

if (!JWT_SECRET_KEY) throw Error('JWT_SECRET_KEY environment variable not set!')
if (!ADMIN_USERNAME) throw Error('ADMIN_USERNAME environment variable not set!')
if (!ADMIN_PASSWORD) throw Error('ADMIN_PASSWORD environment variable not set!')

export const createToken = (username: string, password: string) => {
  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return ''
  }
  const token = jwt.sign({ username, password }, JWT_SECRET_KEY, { expiresIn })
  return token
}