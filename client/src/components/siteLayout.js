import React from "react";

export default function SiteLayout(props) {
  return (
    <div className="bg-white text-slate-900 antialiased">{props.children}</div>
  );
}
