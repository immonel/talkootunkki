import express from "express";
import { checkAuth } from "../../middleware/auth";
import { createToken, expiresIn } from "../../services/auth.service";

const authRouter = express.Router()

authRouter.post('/login', async (request, response, next) => {
  try {
    const { username, password } = request.body
    const token = createToken(username, password)
    if (!token) {
      return response.status(401).end()
    }
    response.status(200).cookie('token', token, {
      expires: new Date(Date.now() + expiresIn),
      secure: false,
      httpOnly: true
    }).end()
  } catch (exception) {
    next(exception)
  }
})

authRouter.post('/logout', async (request, response, next) => {
  try {
    response.clearCookie('token').status(200).end()
  } catch (exception) {
    next(exception)
  }
})

authRouter.post('/validate', checkAuth, async (request, response, next) => {
  try {
    response.status(200).end()
  } catch (exception) {
    next(exception)
  }
})

export default authRouter