export default function LoadingSkeleton() {
    return (
        <div className="space-y-6">

            {[1, 2, 3].map((item) => (

                <div
                    key={item}
                    className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
                >

                    <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>

                    <div className="space-y-3 mb-6">

                        <div className="h-4 bg-gray-200 rounded"></div>

                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>

                    </div>

                    <div className="flex gap-3">

                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                    </div>

                </div>

            ))}

        </div>
    );
}