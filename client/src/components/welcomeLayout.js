import React from "react";

export default function WelcomeLayout(props) {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <div className="hidden items-center space-x-2 md:flex">
            <span>LOGO</span>
            <span className="hidden sm:inline-block text-lg font-bold">
              Voima
            </span>
          </div>
          <button className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-slate-900 px-6 py-1 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2">
            Sign In
          </button>
        </div>
      </header>
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
