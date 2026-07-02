interface RequirementTrendsProps {
    trends: any[];
}

export default function RequirementTrends({
    trends,
}: RequirementTrendsProps) {
    if (!trends || trends.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800">
                    Requirement Trends
                </h2>

                <p className="mt-4 text-slate-500">
                    No trend data available yet.
                </p>
            </div>
        );
    }

    const maxCount = Math.max(
        ...trends.map((item) => Number(item.count || 0)),
        1
    );

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800">
                Requirement Trends
            </h2>

            <p className="mt-1 text-slate-500">
                Requirements created over time.
            </p>

            <div className="mt-6 space-y-4">
                {trends.map((item, index) => {
                    const count = Number(item.count || item.total || 0);
                    const label =
                        item.date ||
                        item.day ||
                        item.month ||
                        `Period ${index + 1}`;

                    return (
                        <div key={label}>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {label}
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {count}
                                </span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${(count / maxCount) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}