// components/ProfileCard.js
import React from "react";

const ProfileCard = ({ user }) => {
  const profileImage = user.profileImage
    ? user.profileImage
    : "/uploads/default-profile.png"; // Default fallback

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={profileImage}
        alt="Profile"
        onError={(e) => (e.target.src = "/uploads/default-profile.png")}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfileCard;
