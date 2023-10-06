import React from "react";
import WelcomeLayout from "../components/welcomeLayout";

export default function WelcomePage() {
  return (
    <WelcomeLayout>
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="mx-auto flex flex-col items-center gap-4 lg:w-[52rem]">
          <h1 className="text-3xl text-center font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-7xl">
            The ultimate tool for planning workouts!
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
            Create balanced workouts set towards your goals!
          </p>
          <div className="flex gap-4">
            <button className="relative inline-flex h-11 items-center rounded-md border border-transparent bg-slate-900 px-8 py-2 font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </WelcomeLayout>
  );
}
