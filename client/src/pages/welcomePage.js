import React from "react";

export default function WelcomePage() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          The ultimate tool for planning workouts!
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Create balanced workouts set towards your goals!
        </p>
        <div className="space-x-4">
          <p>BUTTON HERE</p>
        </div>
      </div>
    </section>
  );
}
