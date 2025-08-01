import React from "react";

const FollowersModal = ({ isOpen, onClose, list, title }) => {
  if (!isOpen) return null;
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <div>
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <ul className="space-y-2">
            {list.length > 0 ? (
              list.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 h-15 bg-base-200 rounded-full p-4 hover:bg-base-300 hover:cursor-pointer"
                  onClick={() => (window.location.href = `/profile/${f.id}`)}
                >
                  <img
                    src={f.profilePicUrl || "https://via.placeholder.com/150"}
                    alt="User's image"
                    className="size-10 rounded-full"
                  />
                  <span className="text-sm font-bold">{f.username}</span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No Users found.</p>
            )}
          </ul>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

export default FollowersModal;
