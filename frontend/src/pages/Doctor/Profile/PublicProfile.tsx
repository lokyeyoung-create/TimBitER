import React, { useEffect, useState } from "react";
import {
  User,
  EnvelopeSimple,
  Phone,
  GraduationCap,
  ClipboardText,
  CaretLeft,
} from "phosphor-react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileAvatar from "components/avatar/Avatar";
import PrimaryButton from "components/buttons/PrimaryButton";
import { doctorService } from "api/services/doctor.service";
import FollowButton from "components/FollowButton/FollowButton";
import BookmarkButton from "components/BookmarkButton/BookmarkButton";
import ReviewsSection from "components/Reviews/ReviewsSection";
import { getFollowStats } from "api/services/follow.service";
import { useAuth } from "contexts/AuthContext";
import toast from "react-hot-toast";

const PublicDoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [followStats, setFollowStats] = useState<{ followers: number; following: number } | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;

      setLoading(true);
      try {
        const data = await doctorService.getByUserId(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        toast.error("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    // load follow stats as well
    const loadStats = async () => {
      if (!doctorId) return;
      try {
        const s = await getFollowStats(doctorId);
        setFollowStats({ followers: s?.followers || 0, following: s?.following || 0 });
      } catch (e) {
        // ignore
      }
    };
    loadStats();
  }, [doctorId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleScheduleAppointment = () => {
    navigate(`/search?doctorId=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-primaryText mb-4">Doctor not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const doctorUser = typeof doctor.user === "object" ? doctor.user : null;
  const doctorName = doctorUser
    ? `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`
    : "Doctor";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary to-[#6886AC] text-white px-12 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
        >
          <CaretLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <ProfileAvatar
              imageUrl={doctorUser?.profilePic}
              name={doctorName}
              size={100}
            />
            <div>
              <h1 className="text-3xl font-semibold mb-2">{doctorName}</h1>
              {doctor.speciality && (
                <p className="text-xl text-white/90 mb-4">{doctor.speciality}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="text-white/90 text-sm">
                  <div className="flex items-center gap-3">
                    <User size={16} />
                    <span>{doctorUser?.firstName} {doctorUser?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/80">Followers:</span>
                    <span className="font-medium">{followStats?.followers ?? '-'}</span>
                    <span className="ml-4 text-xs text-white/80">Following:</span>
                    <span className="font-medium">{followStats?.following ?? '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <FollowButton targetUserId={doctorUser?._id} />
            <BookmarkButton itemId={doctorId || ''} itemType="user" itemName={doctorName} />
            <PrimaryButton
              onClick={handleScheduleAppointment}
              text="Book"
              variant="primary"
              size="medium"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-12 py-8">
        {/* Bio */}
        {doctor.bioContent && (
          <div className="bg-white p-6 rounded-xl border border-stroke shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-primaryText mb-3">
              About Dr. {doctorUser?.lastName}
            </h2>
            <p className="text-primaryText leading-relaxed">
              {doctor.bioContent}
            </p>
          </div>
        )}

        {/* Education & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stroke shadow-sm">
            <h3 className="text-lg font-semibold text-primaryText mb-4 flex items-center gap-2">
              <GraduationCap size={24} className="text-primary" />
              Education & Training
            </h3>
            <div className="space-y-3">
              {doctor.education && (
                <div>
                  <p className="text-sm font-medium text-secondaryText">
                    Medical School
                  </p>
                  <p className="text-primaryText">{doctor.education}</p>
                </div>
              )}
              {doctor.graduationDate && (
                <div>
                  <p className="text-sm font-medium text-secondaryText">
                    Graduated
                  </p>
                  <p className="text-primaryText">
                    {formatDate(doctor.graduationDate)}
                  </p>
                </div>
              )}
              {!doctor.education && !doctor.graduationDate && (
                <p className="text-secondaryText">
                  No education information available
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stroke shadow-sm">
            <h3 className="text-lg font-semibold text-primaryText mb-4 flex items-center gap-2">
              <ClipboardText size={24} className="text-primary" />
              Specialization
            </h3>
            {doctor.speciality ? (
              <div className="px-4 py-3 rounded-lg border">
                <p className="font-medium">{doctor.speciality}</p>
              </div>
            ) : (
              <p className="text-secondaryText">No specialization listed</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-stroke shadow-sm">
          <h3 className="text-lg font-semibold text-primaryText mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const isOwner = user && doctorUser && user._id === doctorUser._id;
              if (isOwner) {
                return (
                  <>
                    {doctorUser?.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <EnvelopeSimple size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-secondaryText">Email</p>
                          <p className="text-sm text-primaryText">{doctorUser.email}</p>
                        </div>
                      </div>
                    )}
                    {doctorUser?.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Phone size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-secondaryText">Phone</p>
                          <p className="text-sm text-primaryText">{doctorUser.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </>
                );
              }

              // not owner
              return (
                <div className="col-span-full">
                  <p className="text-secondaryText mb-3">Contact details are hidden.</p>
                  <div className="flex gap-3">
                    <PrimaryButton onClick={handleScheduleAppointment} text="Book an appointment" variant="primary" size="small" />
                    {!user && (
                      <PrimaryButton onClick={() => navigate('/login')} text="Login to view" variant="outline" size="small" />
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection doctorId={doctorId || ''} doctorName={doctorName} />
      </div>
    </div>
  );
};

export default PublicDoctorProfile;
