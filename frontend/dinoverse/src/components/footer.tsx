import React from 'react';
import { LuEarth } from "react-icons/lu";
import { LuSchool } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";



const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex bg-[var(--primary-pink)] text-white">
    <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
        <LuEarth className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
        <LuSchool className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center relative">
        <div className="bg-white text-[var(--primary-pink)] w-15 h-12 flex items-center justify-center 
                        rounded-md border-2 border-[var(--primary-pink)] absolute -top-4">
          <FiPlus className="text-2xl" />
        </div>
      </div>
    <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
        <MdOutlinePeopleAlt className="text-3xl" />
    </div>
    <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
        <MdOutlinePersonOutline className="text-3xl" />
    </div>
  </footer>
  )
}

export default Footer