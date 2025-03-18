import React from 'react';
import { LuEarth } from "react-icons/lu";
import { LuSchool } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex bg-[var(--primary-pink)] text-white">
    <div className="flex-1 flex items-center justify-center p-4">
        <LuEarth className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
        <LuSchool className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
        <FiPlus className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
        <MdOutlinePeopleAlt className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
        <MdOutlinePersonOutline className="text-3xl" />
    </div>
  </footer>
  )
}

export default Footer