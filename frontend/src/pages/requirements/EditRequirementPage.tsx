import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getRequirement,
    updateRequirement,
} from "../../services/requirementService";

export default function EditRequirementPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [status, setStatus] = useState("");

    useEffect(() => {
        loadRequirement();
    }, []);

    async function loadRequirement() {

        if (!id) return;

        const requirement = await getRequirement(id);

        setTitle(requirement.title);

        setDescription(requirement.description);

        setStatus(requirement.status);
    }

    async function handleSave() {

        if (!id) return;

        await updateRequirement(
            id,
            {
                title,
                description,
                status,
            }
        );

        alert("Requirement updated successfully.");

        navigate(`/requirements/${id}`);
    }

    return (

        <div className="p-8 max-w-4xl">

            <h1 className="text-4xl font-bold mb-8">
                Edit Requirement
            </h1>

            <div className="space-y-6">

                <div>

                    <label className="block mb-2 font-semibold">
                        Title
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Description
                    </label>

                    <textarea
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-xl p-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-xl p-3"
                    >

                        <option value="draft">
                            Draft
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                    </select>

                </div>

                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                >
                    Save Changes
                </button>

            </div>

        </div>

    );

}