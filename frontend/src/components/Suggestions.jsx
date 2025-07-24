import React from "react";

const Suggestions = () => {
  return (
    <div className="pt-8 px-5 ">
      <div className="flex flex-col gap-2">
        <h1 className="mb-3 uppercase font-semibold text-md opacity-75 tracking-wider">
          Suggestions
        </h1>
        {/* this could be a component */}
        <div className="flex justify-between px-3 py-3 w-[95%] m-auto rounded-xl bg-base-200">
          <span className="flex justify-start items-center gap-3">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
              alt="image"
              className="h-8 w-8 rounded-full "
            />
            <h3 className="text-sm font-semibold">User 1</h3>
          </span>
          <button className="btn btn-primary text-sm btn-sm">Follow</button>
        </div>

        {/* this is end of the div  */}
        <div className="flex justify-between px-3 py-3 w-[95%] m-auto rounded-xl bg-base-200">
          <span className="flex justify-start items-center gap-3">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
              alt="image"
              className="h-8 w-8 rounded-full "
            />
            <h3 className="text-sm font-semibold">User 1</h3>
          </span>
          <button className="btn btn-primary text-sm btn-sm">Follow</button>
        </div>
        <div className="flex justify-between px-3 py-3 w-[95%] m-auto rounded-xl bg-base-200">
          <span className="flex justify-start items-center gap-3">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
              alt="image"
              className="h-8 w-8 rounded-full "
            />
            <h3 className="text-sm font-semibold">User 1</h3>
          </span>
          <button className="btn btn-primary text-sm btn-sm">Follow</button>
        </div>
        <div className="flex justify-between px-3 py-3 w-[95%] m-auto rounded-xl bg-base-200">
          <span className="flex justify-start items-center gap-3">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
              alt="image"
              className="h-8 w-8 rounded-full "
            />
            <h3 className="text-sm font-semibold">User 1</h3>
          </span>
          <button className="btn btn-primary text-sm btn-sm">Follow</button>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
