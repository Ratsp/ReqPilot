interface Props {
    title: string;
    value: any;
}

export default function AIResultCard({
    title,
    value,
}: Props) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-lg font-bold text-slate-800 mb-3">
                {title}
            </h3>

            <div className="text-gray-700 whitespace-pre-wrap leading-7">

                {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value)}

            </div>

        </div>
    );
}