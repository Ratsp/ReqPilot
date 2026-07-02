
import {
    FaClipboardList,
    FaCheckCircle,
    FaFileAlt,
    FaStar,
} from "react-icons/fa";

interface Props {
    title: string;
    value: string | number;
}

export default function StatCard({
    title,
    value,
}: Props) {

    const icons: any = {
        Requirements: <FaClipboardList size={34} />,
        Draft: <FaFileAlt size={34} />,
        Completed: <FaCheckCircle size={34} />,
        "Quality Score": <FaStar size={34} />,
    };

    return (

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition duration-300 p-6">

            <div className="flex justify-between">

                <div>

                    <p className="text-blue-100">

                        {title}

                    </p>

                    <h2 className="text-5xl font-bold mt-4">

                        {value}

                    </h2>

                </div>

                <div className="opacity-80">

                    {icons[title]}

                </div>

            </div>

        </div>

    );
}