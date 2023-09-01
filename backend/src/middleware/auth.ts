import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET_KEY || ''

export const checkAuth: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  const token = request.cookies.token
  if (!token) {
    return response.status(401).send('No token provided')
  }
  try {
    jwt.verify(token, secret)
  } catch (error) {
    return response.status(403).send('Invalid token')
  }
  next()
}