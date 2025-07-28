const EditProfileModal = ({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <input
          type="text"
          value={editForm.username}
          onChange={(e) =>
            setEditForm({ ...editForm, username: e.target.value })
          }
          className="input input-neutral w-full mb-3"
          placeholder="Username"
        />
        <textarea
          value={editForm.bio}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          className="textarea textarea-neutral w-full mb-3"
          placeholder="Bio"
        />
        <input
          type="text"
          value={editForm.profilePicUrl}
          onChange={(e) =>
            setEditForm({ ...editForm, profilePicUrl: e.target.value })
          }
          className="input input-neutral w-full mb-3"
          placeholder="Profile Picture URL"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-primary" onClick={onSave}>
            Save
          </button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

export default EditProfileModal;
