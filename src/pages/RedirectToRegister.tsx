import { Navigate } from 'react-router-dom'

/**
 * /r/:slug — the creator "book a post" deep link. On naano.com it bounces
 * visitors without a session to the marketing site; here it lands on /register.
 */
export default function RedirectToRegister() {
  return <Navigate to="/register" replace />
}
