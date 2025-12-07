import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "contexts/AuthContext";
import { patientService } from "api/services/patient.service";
import { userService } from "api/services/user.service";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/modal/SuccessModal";

const PatientEditRequest: React.FC = () => {
  const { user: authUser, token, login } = useAuth();
  const [patient, setPatient] = useState<any | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchPatient = async () => {
      if (!authUser?._id) return;
      setLoading(true);
      try {
        const data = await patientService.getById(authUser._id);
        const d: any = data;
        setPatient(d);

        let emergencyPhone = "";
        const ec0 = d?.emergencyContact && d.emergencyContact[0];
        if (ec0) {
          if (typeof ec0 === "object") emergencyPhone = ec0.phoneNumber || "";
        }

        const allergies = Array.isArray(d.allergies) ? d.allergies : [];
        const medicalHistory = Array.isArray(d.medicalHistory)
          ? d.medicalHistory
          : [];

        let birthdayIso = "";
        if (d?.birthday) {
          birthdayIso =
            typeof d.birthday === "string"
              ? d.birthday.split("T")[0]
              : new Date(d.birthday).toISOString().split("T")[0];
        }

        setFormData({
          fullName: `${(d.user as any)?.firstName || ""} ${(d.user as any)?.lastName || ""}`.trim(),
          gender: (d.user as any)?.gender || "",
          bloodtype: d.bloodtype || "",
          birthday: birthdayIso,
          phoneNumber: (d.user as any)?.phoneNumber || "",
          email: (d.user as any)?.email || "",
          address: d.address || "",
          emergencyContact: emergencyPhone,
          allergies,
          conditions: medicalHistory,
        });
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [authUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleArrayChange = (name: string, values: string[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: values }));
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    if (!patient || !authUser?._id) return;

    setLoading(true);
    try {
      // Prepare user updates
      const nameParts = (formData.fullName || "").trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ") || "";

      let profilePicValue = (patient.user as any)?.profilePic || authUser?.profilePic || null;
      if (newProfilePic) {
        profilePicValue = await convertToBase64(newProfilePic);
      }

      const userUpdate: any = {
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        gender: formData.gender,
      };
      if (profilePicValue) userUpdate.profilePic = profilePicValue;

      const userRes = await userService.update(authUser._id, userUpdate);

      // Update AuthContext and localStorage so changes appear immediately
      const updatedUser = userRes?.user || userRes;
      if (updatedUser) {
        try {
          // use existing token to keep session
          login(token as string, updatedUser);
        } catch (e) {
          // fallback: write to localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      // Prepare patient updates
      const patientUpdate: any = {
        birthday: formData.birthday || null,
        address: formData.address || "",
        bloodtype: formData.bloodtype || "",
        allergies: Array.isArray(formData.allergies) ? formData.allergies : (typeof formData.allergies === 'string' ? formData.allergies.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        medicalHistory: Array.isArray(formData.conditions) ? formData.conditions : (typeof formData.conditions === 'string' ? formData.conditions.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
      };

      await patientService.update(authUser._id, patientUpdate);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/patient-profile");
      }, 1200);
    } catch (err) {
      console.error(err);
      // keep it simple: alert
      alert("Failed to update profile. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex flex-col w-full bg-[#f9f9f9] min-h-screen">
      <div className="h-40 bg-gradient-to-r from-primary to-[#6886AC]" />
      <div className="relative -mt-20 mx-auto w-[90%] max-w-6xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Patient Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <img
                src={
                  previewUrl || (patient?.user as any)?.profilePic || authUser?.profilePic || "https://placehold.co/120x120"
                }
                alt="Profile"
                className="w-28 h-28 rounded-lg object-cover border cursor-pointer hover:opacity-80 transition"
                onClick={handleImageClick}
              />
              <p className="text-sm text-gray-500 mt-2">Click image to change</p>
            </div>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Full Name"
            />
            <input
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Gender"
            />
            <input
              name="bloodtype"
              value={formData.bloodtype}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Blood Type"
            />
            <input
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Phone Number"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Email"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Address"
            />
            <input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              placeholder="Emergency Contact"
            />
            <textarea
              name="allergies"
              value={(formData.allergies || []).join(", ")}
              onChange={(e) =>
                handleArrayChange(
                  "allergies",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              className="border rounded-md p-2 h-20"
              placeholder="Allergies (comma separated)"
            />
            <textarea
              name="conditions"
              value={(formData.conditions || []).join(", ")}
              onChange={(e) =>
                handleArrayChange(
                  "conditions",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              className="border rounded-md p-2 h-20"
              placeholder="Conditions (comma separated)"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
                disabled={loading}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        message="Your profile has been updated"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default PatientEditRequest;
