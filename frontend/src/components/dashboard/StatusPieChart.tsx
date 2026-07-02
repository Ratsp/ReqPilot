import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    draft: number;
    pending: number;
    approved: number;
    completed: number;
}

const COLORS = [
    "#FACC15", // Draft
    "#F97316", // Pending
    "#3B82F6", // Approved
    "#22C55E", // Completed
];

export default function StatusPieChart({
    draft,
    pending,
    approved,
    completed,
}: Props) {
    const data = [
        { name: "Draft", value: draft },
        { name: "Pending", value: pending },
        { name: "Approved", value: approved },
        { name: "Completed", value: completed },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 h-[380px]">

            <h2 className="text-2xl font-bold mb-4">
                Requirement Status
            </h2>

            <ResponsiveContainer width="100%" height="90%">
                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={120}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                </PieChart>
            </ResponsiveContainer>

        </div>
    );
}