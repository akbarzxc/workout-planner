/*
MIT License

Copyright (c) 2022 shadcn
Copyright (c) 2023 Veeti Pihlava

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from "react";
import { SignInButton } from "@clerk/clerk-react";

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
          <SignInButton
            className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-slate-900 px-6 py-1 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
            redirectUrl="/dashboard"
          >
            Sign In
          </SignInButton>
        </div>
      </header>
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
