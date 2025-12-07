import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
      <p className="text-sm text-secondaryText mb-4">
        Willow CRM collects minimal data required to provide services. We store user profiles, reviews, bookmarks, and appointment data. We do not sell your data. For detailed information, please consult your course privacy requirements.
      </p>
      <h2 className="font-medium mt-4">Data Collected</h2>
      <ul className="list-disc ml-6 text-sm text-secondaryText">
        <li>User profile information (name, role, profile picture)</li>
        <li>Reviews and bookmarks associated with external items</li>
        <li>Appointments and scheduling data</li>
      </ul>
      <h2 className="font-medium mt-4">Contact</h2>
      <p className="text-sm text-secondaryText">Contact the site administrator for data inquiries.</p>
    </div>
  );
};

export default PrivacyPolicy;
