import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import useAuthUser from "./hooks/useAuthUser";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import ProfilePage from "./pages/ProfilePage";
import PostDetailsPage from "./pages/PostDetailsPage";
import Loader from "./components/Loader";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function RouteChangeProgress() {
  const location = useLocation();
  const isFetching = useIsFetching(); // React Query active fetch count

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return null;
}

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const theme = useThemeStore((state) => state.theme);

  if (isLoading) return <Loader className="w-screen h-screen mx-auto" />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <RouteChangeProgress />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout showSidebar showSuggestions>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:userId"
          element={
            isAuthenticated ? (
              <Layout>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/post/:postId"
          element={
            isAuthenticated ? (
              <Layout>
                <PostDetailsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
