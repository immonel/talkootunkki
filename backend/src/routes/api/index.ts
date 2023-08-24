import express from 'express'
import type { Router } from 'express';

import eventsRouter from './events.route'
import registrationRouter from './register.route';
import participationsRouter from './participations.route';

const apiRouter = express.Router()

interface Route {
  path: string;
  router: Router;
}

const defaultRoutes: Route[] = [
  {
    path: '/events',
    router: eventsRouter
  },
  {
    path: '/register',
    router: registrationRouter
  },
  {
    path: '/participations',
    router: participationsRouter
  }
]

const devRoutes: Route[] = [

]

defaultRoutes.forEach(route => {
  apiRouter.use(route.path, route.router)
})

if (process.env.NODE_ENV === 'development') {
  devRoutes.forEach((route) => {
    apiRouter.use(route.path, route.router);
  });
}

export default apiRouter