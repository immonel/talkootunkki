import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/admin'
import TWALayout from './layouts/twa'

import TelegramWebApp from '../pages/twa'
import CodePage from '../pages/code'
import AdminPage from '../pages/admin'
import CreateEventPage from '../pages/admin/create_event'
import RegisterPage from '../pages/twa/register'
import TWALeaderboardPage from '../pages/twa/leaderboards'
import EventAdminPage from '../pages/admin/event'
import LoginPage from '../pages/login'
import LogoutPage from '../pages/logout'
import RequireAuth from './RequireAuth'
import FinishPage from '../pages/twa/finish'
import NotFound from '../pages/404'
import PrizesPage from '../pages/twa/prizes'

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/code' element={
        <RequireAuth>
          <CodePage />
        </RequireAuth>
      } />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/logout' element={<LogoutPage />} />
      <Route element={<TWALayout />}>
        <Route path='/' element={<TelegramWebApp />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/finish' element={<FinishPage />} />
        <Route path='/leaderboards' element={<TWALeaderboardPage />} />
        <Route path='/prizes' element={<PrizesPage />} />
      </Route>
      <Route path='/twa' element={<Navigate to='/' replace />} />
      <Route path='/twa/register' element={<Navigate to='/register' replace />} />
      <Route path='/twa/finish' element={<Navigate to='/finish' replace />} />
      <Route path='/twa/leaderboards' element={<Navigate to='/leaderboards' replace />} />
      <Route path='/twa/prizes' element={<Navigate to='/prizes' replace />} />
      <Route element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/admin/create_event' element={<CreateEventPage />} />
        <Route path='/admin/event/:event_id' element={<EventAdminPage />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default Router
