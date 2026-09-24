import { useEffect, useState } from "react";
import { getMyProviderProfile, updateMyProviderProfile } from "../../api/providers";
import "../../styles/provider-profile-dashboard.css";

export default function ProviderProfile() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            const res = await getMyProviderProfile();
            const p = res.data || {};
            setProfile(p);
            setFormData({
                bio: p.bio || "",
                basePrice: p.basePrice || p.startingPrice || 0,
                experienceYears: p.experienceYears || 0,
                skills: Array.isArray(p.skills) ? p.skills.join(", ") : p.skills || "",
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            setSaving(true);
            const payload = {
                bio: formData.bio,
                basePrice: Number(formData.basePrice),
                experienceYears: Number(formData.experienceYears),
                skills: typeof formData.skills === "string"
                    ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : formData.skills,
            };
            const res = await updateMyProviderProfile(payload);
            setProfile(res.data || { ...profile, ...payload });
            setEditing(false);
            setSuccess("Profile updated!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;

    const displayName = profile?.user?.name || profile?.name || "Provider";
    const displayEmail = profile?.user?.email || profile?.email || "N/A";
    const displayPhone = profile?.user?.phone || profile?.phone || "N/A";
    const displayCategories = profile?.categories
        ?.map((c) => (typeof c === "object" ? c.name : c))
        .join(", ") || profile?.category || "General";

    return (
        <div className="provider-profile">
            <div className="pp-header">
                <h1>My Profile</h1>
                {!editing && (
                    <button
                        className="cc-btn cc-btn-primary"
                        onClick={() => setEditing(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

            {error && <div className="cc-error">{error}</div>}
            {success && <div className="cc-success">{success}</div>}

            {profile && (
                <div className="pp-container">
                    <div className="pp-section">
                        <h2>Basic Info</h2>
                        {editing ? (
                            <div className="pp-form">
                                <label>
                                    Name
                                    <input type="text" value={displayName} disabled />
                                </label>
                                <label>
                                    Email
                                    <input type="email" value={displayEmail} disabled />
                                </label>
                                <label>
                                    Phone
                                    <input type="tel" value={displayPhone} disabled />
                                </label>
                                <label>
                                    Bio
                                    <textarea
                                        value={formData.bio || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, bio: e.target.value })
                                        }
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="pp-display">
                                <p>
                                    <strong>Name:</strong> {displayName}
                                </p>
                                <p>
                                    <strong>Email:</strong> {displayEmail}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {displayPhone}
                                </p>
                                <p>
                                    <strong>Bio:</strong> {profile.bio || "No bio added yet."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pp-section">
                        <h2>Services & Pricing</h2>
                        {editing ? (
                            <div className="pp-form">
                                <label>
                                    Categories
                                    <input type="text" value={displayCategories} disabled />
                                </label>
                                <label>
                                    Base / Starting Price (₹)
                                    <input
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, basePrice: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Experience (Years)
                                    <input
                                        type="number"
                                        value={formData.experienceYears}
                                        onChange={(e) =>
                                            setFormData({ ...formData, experienceYears: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Skills (comma separated)
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) =>
                                            setFormData({ ...formData, skills: e.target.value })
                                        }
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="pp-display">
                                <p>
                                    <strong>Categories:</strong> {displayCategories}
                                </p>
                                <p>
                                    <strong>Starting Price:</strong> ₹{profile.basePrice || profile.startingPrice || 0}
                                </p>
                                <p>
                                    <strong>Experience:</strong> {profile.experienceYears || 0} years
                                </p>
                                <p>
                                    <strong>Skills:</strong>{" "}
                                    {Array.isArray(profile.skills)
                                        ? profile.skills.join(", ")
                                        : profile.skills || "None listed"}
                                </p>
                                <p>
                                    <strong>Verification Status:</strong>{" "}
                                    <span className={`cc-status cc-status-${profile.isVerified ? "booked" : "quoted"}`}>
                                        {profile.isVerified ? "Verified" : "Pending Verification"}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {editing && (
                        <div className="pp-actions">
                            <button
                                className="cc-btn cc-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="cc-btn cc-btn-secondary"
                                onClick={() => {
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
