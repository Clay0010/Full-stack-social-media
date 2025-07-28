import { useNavigate } from "react-router-dom";

const UserCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-start items-center w-full shadow-sm p-2 gap-5 hover:bg-base-300 hover:cursor-pointer rounded-xl bg-base-200 my-2"
      onClick={() => navigate(`/profile/${data.id}`)}
    >
      <img
        src={
          data.profilePicUrl ||
          "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
        }
        alt="image"
        className="h-8 w-8 rounded-full "
      />
      <h3 className="font-semibold">{data.username}</h3>
    </div>
  );
};

export default UserCard;
