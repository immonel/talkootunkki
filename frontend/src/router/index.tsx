import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/admin'
import TWALayout from './layouts/twa'

import Frontpage from '../pages/frontpage'
import TelegramWebApp from '../pages/twa'
import CodePage from '../pages/code'
import AdminPage from '../pages/admin'
import CreateEventPage from '../pages/admin/create_event'
import RegisterPage from '../pages/register'
import TWALeaderboardPage from '../pages/twa/leaderboards'
import EventAdminPage from '../pages/admin/event'

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Frontpage />} />
      <Route path='/code' element={<CodePage />} />
      <Route element={<TWALayout />}>
        <Route path='/twa' element={<TelegramWebApp />} />
        <Route path='/twa/register' element={<RegisterPage />} />
        <Route path='/twa/leaderboards' element={<TWALeaderboardPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/admin/create_event' element={<CreateEventPage />} />
        <Route path='/admin/event/:event_id' element={<EventAdminPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default Router