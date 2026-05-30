import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Write from './pages/Write';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="write" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="edit/:id" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
        <Route path="search" element={<Search />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
