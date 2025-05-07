"use client";

import { ClipLoader } from "react-spinners";

export function LoadingSpinner({ size = 35, color = "#ffffff" }) {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader size={size} color={color} />
    </div>
  );
}
