"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/ui/button"; // Ensure you have a Button component
import { useProfile } from "@/contexts/ProfleContext";
import { updateProfile } from "./action";
import Input from "@/app/ui/dashboard/profile/edit/Input"; // Import the new Input component
import toast from "react-hot-toast";
import BasicInfo from "@/app/ui/dashboard/profile/edit/BasicInfo";

export default function Page() {
 
  return (
    <div className="overflow-hidden">
      <BasicInfo/>
    </div>
  );
}
