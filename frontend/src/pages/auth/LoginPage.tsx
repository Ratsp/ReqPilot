import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
type LoginForm = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(data: LoginForm) {
        try {
            setLoading(true);
            setError("");

            const response = await login(data);

            console.log(response);

            authLogin(response.access_token);
            navigate("/");

        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px]">

            <h1 className="text-4xl font-bold text-center text-blue-600">
                ReqPilot AI
            </h1>

            <p className="text-gray-500 text-center mt-2 mb-8">
                Sign in to continue
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >

                <div>

                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                        className="w-full border rounded-lg p-3"
                    />

                    <p className="text-red-500 text-sm">
                        {errors.email?.message}
                    </p>

                </div>

                <div>

                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                        className="w-full border rounded-lg p-3"
                    />

                    <p className="text-red-500 text-sm">
                        {errors.password?.message}
                    </p>

                </div>
                <p className="text-center mt-5 text-gray-600">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 ml-1 hover:underline"
                    >
                        Register
                    </Link>
                </p>

                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 transition"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

            </form>

        </div>
    );
}