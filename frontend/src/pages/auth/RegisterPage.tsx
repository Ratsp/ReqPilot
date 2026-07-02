import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            await register(form);

            toast.success("Registration successful");

            navigate("/login");

        }
        catch (err: any) {

            console.log(err.response?.data);

            const message =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                "Registration failed.";

            toast.error(message);

        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-5"
            >

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            full_name: e.target.value,
                        })
                    }
                />

                <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-xl p-3"
                >
                    {loading ? "Creating..." : "Register"}
                </button>

                <p className="text-center text-gray-500">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 ml-1"
                    >
                        Login
                    </Link>

                </p>

            </form>

        </div>
    );
}