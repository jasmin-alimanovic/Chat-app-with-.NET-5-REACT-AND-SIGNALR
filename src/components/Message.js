import React from "react";

export default function Message({ message }) {
  return (
    <div className="user-message">
      <div className="message">{message.message}</div>
      <div className="from-user">{message.user}</div>
    </div>
  );
}
