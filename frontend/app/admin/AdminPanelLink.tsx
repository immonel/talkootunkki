import Link from 'next/link'
import React from 'react'

const AdminPanelLink = () => (
  <Link href="/admin" className="flex items-center gap-3">
    <i className="bi-arrow-left text-2xl" />
    <h1>Admin panel</h1>
  </Link>
)

export default AdminPanelLink