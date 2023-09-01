import express from 'express'
import type { RequestHandler, Router } from 'express';

import eventsRouter from './events.route'
import registrationRouter from './register.route';
import participationsRouter from './participations.route';
import authRouter from './auth.route';
import { checkAuth } from '../../middleware/auth';

const apiRouter = express.Router()

interface Route {
  path: string;
  router: Router;
}

interface ProtectedRoute extends Route {
  auth: RequestHandler;
}

const defaultRoutes: Route[] = [
  {
    path: '/register',
    router: registrationRouter
  },
  {
    path: '/auth',
    router: authRouter
  }
]

const protectedRoutes: ProtectedRoute[] = [
  {
    path: '/events',
    router: eventsRouter,
    auth: checkAuth
  },
  {
    path: '/participations',
    router: participationsRouter,
    auth: checkAuth
  }
]

const devRoutes: Route[] = [

]

defaultRoutes.forEach(route => {
  apiRouter.use(route.path, route.router)
})

protectedRoutes.forEach(route => {
  apiRouter.use(route.path, route.auth, route.router)
})

if (process.env.NODE_ENV === 'development') {
  devRoutes.forEach((route) => {
    apiRouter.use(route.path, route.router);
  });
}

export default apiRouter