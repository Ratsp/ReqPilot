interface Activity {
    id: string;
    title: string;
    status: string;
    updated_at: string;
}

interface Props {
    activities: Activity[];
}

export default function RecentActivities({
    activities,
}: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md mt-8 p-6">

            <h2 className="text-2xl font-bold mb-5">
                Recent Activities
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-3">Requirement</th>

                        <th className="text-left">Status</th>

                        <th className="text-left">Updated</th>

                    </tr>

                </thead>

                <tbody>

                    {activities.map((activity) => (

                        <tr
                            key={activity.id}
                            className="border-b hover:bg-gray-50"
                        >

                            <td className="py-4">
                                {activity.title}
                            </td>

                            <td>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${activity.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : activity.status === "draft"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {activity.status}
                                </span>

                            </td>

                            <td>
                                {new Date(
                                    activity.updated_at
                                ).toLocaleDateString()}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}