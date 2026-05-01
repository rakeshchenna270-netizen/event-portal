import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './routes/ProtectedRoutes';

import Navbar          from './components/Navbar';
import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import EventDetail     from './pages/EventDetail';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard  from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* Private Routes */}
              <Route
                path="/my-registrations"
                element={
                  <PrivateRoute>
                    <MyRegistrations />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
