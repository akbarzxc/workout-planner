/*
MIT License

Copyright (c) 2022 shadcn
Copyright (c) 2023 Veeti Pihlava

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from "react";
import WelcomeLayout from "../components/welcomeLayout";
import { SignInButton } from "@clerk/clerk-react";

export default function Welcome() {
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
            <SignInButton
              className="relative inline-flex h-11 items-center rounded-md border border-transparent bg-slate-900 px-8 py-2 font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              redirectUrl="/dashboard"
            >
              Get Started
            </SignInButton>
          </div>
        </div>
      </section>
    </WelcomeLayout>
  );
}
