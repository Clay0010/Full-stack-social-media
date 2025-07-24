import React from "react";

const Group = () => {
  return (
    <div className="flex justify-start items-center w-full shadow-sm p-2 gap-5 hover:bg-base-300 rounded-xl bg-base-200 my-2">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
        alt="image"
        className="h-8 w-8 rounded-full "
      />
      <h3 className="font-semibold">group name</h3>
    </div>
  );
};

export default Group;
