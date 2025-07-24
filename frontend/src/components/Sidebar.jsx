import React from "react";
import Group from "./Group";
import Friend from "./Friend";

const Sidebar = () => {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto pt-8 flex flex-col gap-2 items-center justify-start hide-scrollbar">
      <h1 className="font-semibold text-md tracking-wider w-[75%] uppercase opacity-75 ">
        Groups
      </h1>
      <div className="max-h-[35%]  overflow-y-auto hide-scrollbar w-[75%]">
        <Group />
        <Group />
        <Group />
        <Group />
        <Group />
        <Group />
      </div>
      {/* asdasdasd */}
      <h1 className="font-semibold text-md tracking-wider w-[75%] uppercase opacity-75 ">
        Friends
      </h1>
      <div className="max-h-[45%]  overflow-y-auto hide-scrollbar w-[75%]">
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
      </div>
    </div>
  );
};

export default Sidebar;
