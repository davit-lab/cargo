import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuthStore } from '@/stores/useAuthStore';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import CreatePost from '@/pages/CreatePost';
import CargoList from '@/pages/CargoList';
import RouteList from '@/pages/RouteList';
import MapView from '@/pages/MapView';
import Messages from '@/pages/Messages';
import Profile from '@/pages/Profile';
import MyPosts from '@/pages/MyPosts';
import HeavyEquipment from '@/pages/HeavyEquipment';
import EquipmentDetails from '@/pages/EquipmentDetails';
import Packets from '@/pages/Packets';
import Billing from '@/pages/Billing';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';

const App = () => {
  const { user, profile, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Auth /> : <Navigate to="/" />} />
          <Route path="/cargo" element={<CargoList />} />
          <Route path="/routes" element={<RouteList />} />
          <Route path="/heavy-equipment" element={<HeavyEquipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/packets" element={<Packets />} />
          
          {/* Protected Routes */}
          <Route path="/create-post" element={user && profile?.role === 'owner' ? <CreatePost /> : <Navigate to="/login" />} />
          <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/my-posts" element={user ? <MyPosts /> : <Navigate to="/login" />} />
          <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
          
          {/* Owner Routes */}
          <Route path="/owner/*" element={user && profile?.role === 'owner' ? <OwnerDashboard /> : <Navigate to="/" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
    </ErrorBoundary>
  );
};

export default App;
