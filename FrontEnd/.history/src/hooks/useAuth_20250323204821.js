import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, selectIsAuthenticated, selectUserRole, logout } from "../redux/slices/authSlice"

export const useAuth = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return {
    user,
    isAuthenticated,
    role,
    logout: handleLogout,
    isAdmin: role === "admin",
    isPhotographer: role === "photographer",
    isClient: role === "client",
  }
}

