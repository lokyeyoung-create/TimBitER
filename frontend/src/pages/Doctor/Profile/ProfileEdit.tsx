import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { doctorService } from "api/services/doctor.service";
import { userService } from "api/services/user.service";
import toast from "react-hot-toast";

const DoctorProfileEdit: React.FC = () => {
  const { user: userContext, token, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userContext?._id) return;
      try {
        const d = await doctorService.getByUserId(userContext._id);
        setForm({
          firstName: userContext.firstName,
          lastName: userContext.lastName,
          phoneNumber: userContext.phoneNumber,
          profilePic: userContext.profilePic,
          bioContent: d?.bioContent || "",
          education: d?.education || "",
          speciality: d?.speciality || "",
          graduationDate: d?.graduationDate || "",
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [userContext]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userContext?._id) return;
    setLoading(true);
    try {
      const userRes = await userService.update(userContext._id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        profilePic: form.profilePic,
      });

      // update auth context so profile reflects changes immediately
      const updatedUser = userRes?.user || userRes;
      if (updatedUser) {
        try {
          login(token as string, updatedUser);
        } catch (e) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      await doctorService.updateByUserId(userContext._id, {
        bioContent: form.bioContent,
        education: form.education,
        speciality: form.speciality,
        graduationDate: form.graduationDate,
      });

      toast.success("Profile updated");
      navigate("/doctor-profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update doctor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Doctor Profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={form.firstName || ""} onChange={onChange} className="input" placeholder="First name" />
            <input name="lastName" value={form.lastName || ""} onChange={onChange} className="input" placeholder="Last name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="phoneNumber" value={form.phoneNumber || ""} onChange={onChange} className="input" placeholder="Phone" />
            <input name="profilePic" value={form.profilePic || ""} onChange={onChange} className="input" placeholder="Profile pic URL" />
          </div>
          <div>
            <input name="education" value={form.education || ""} onChange={onChange} className="input" placeholder="Education" />
          </div>
          <div>
            <input name="speciality" value={form.speciality || ""} onChange={onChange} className="input" placeholder="Speciality" />
          </div>
          <textarea name="bioContent" value={form.bioContent || ""} onChange={onChange} className="input" placeholder="Bio" />

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;
