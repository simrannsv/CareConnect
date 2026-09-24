import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    deactivateCategory,
} from "../../api/categories";
import "../../styles/admin-categories.css";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [newCat, setNewCat] = useState({ name: "", description: "" });

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);
            const res = await getCategories();
            setCategories(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate() {
        if (!newCat.name) {
            setError("Category name required");
            return;
        }

        try {
            setCreating(true);
            await createCategory(newCat);
            setNewCat({ name: "", description: "" });
            await loadCategories();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create category");
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this category?")) return;

        try {
            await deactivateCategory(id);
            await loadCategories();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete category");
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;

    return (
        <div className="admin-categories">
            <h1>Manage Categories</h1>

            {error && <div className="cc-error">{error}</div>}

            <div className="ac-form">
                <h2>Add New Category</h2>
                <input
                    type="text"
                    placeholder="Category name"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                />
                <button
                    className="cc-btn cc-btn-primary"
                    onClick={handleCreate}
                    disabled={creating}
                >
                    {creating ? "Creating..." : "Create"}
                </button>
            </div>

            <div className="ac-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td>{cat.description || cat.slug || "No description"}</td>
                                <td>
                                    <button
                                        className="cc-btn cc-btn-danger"
                                        onClick={() => handleDelete(cat._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
