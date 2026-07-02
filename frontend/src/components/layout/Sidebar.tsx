import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white">

            <div className="text-3xl font-bold p-6 border-b border-slate-700">
                ReqPilot
            </div>

            <nav className="mt-8">

                <Link
                    to="/"
                    className="block px-6 py-3 hover:bg-slate-800"
                >
                    Dashboard
                </Link>

                <Link
                    to="/requirements"
                    className="block px-6 py-3 hover:bg-slate-800"
                >
                    Requirements
                </Link>

                <Link
                    to="/requirements/upload"
                    className="block px-6 py-3 hover:bg-slate-800"
                >
                    Upload
                </Link>

                <Link
                    to="/compare"
                    className="block px-6 py-3 hover:bg-slate-800"
                >
                    Compare
                </Link>

                <a
                    href="#"
                    className="block px-6 py-3 hover:bg-slate-800"
                >
                    Export
                </a>

            </nav>

        </aside>
    );
}