import { Routes, Route, Navigate } from "react-router-dom";


import DashboardPage from "../pages/dashboard/DashboardPage";
import RequirementListPage from "../pages/requirements/RequirementListPage";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import RequirementDetailsPage from "../pages/requirements/RequirementDetailsPage";
import EditRequirementPage from "../pages/requirements/EditRequirementPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import UploadRequirementPage from "../pages/requirements/UploadRequirementPage";
import CompareRequirementsPage from "../pages/requirements/CompareRequirementsPage";

import WebpageAnalysisPage from "../pages/requirements/WebpageAnalysisPage";

export default function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <LoginPage />
                    </AuthLayout>
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/requirements"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <RequirementListPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/requirements/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <RequirementDetailsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" />}
            />
            <Route
                path="/requirements/:id/edit"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <EditRequirementPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <AuthLayout>
                        <RegisterPage />
                    </AuthLayout>
                }
            />
            <Route
                path="/requirements/upload"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <UploadRequirementPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/compare"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CompareRequirementsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/requirements/webpage"
                element={<WebpageAnalysisPage />}
            />

        </Routes>
    );
}

