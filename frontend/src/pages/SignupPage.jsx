import { AlignHorizontalJustifyStartIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useSignUp from "../hooks/useSignUp";
import { axiosInstance } from "../lib/axios";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { error, isPending, signUpMutation } = useSignUp();

  const hanldeSignUp = (e) => {
    e.preventDefault();

    signUpMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="night"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* signup form - left side */}

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            {/* <ShipWheelIcon className="size-9 text-primary" /> */}
            <AlignHorizontalJustifyStartIcon className="size-9 text-primary" />
            {/* <CassetteTapeIcon /> */}
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              CircleUp
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.error}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={hanldeSignUp}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-6">
                  Create an account
                </h2>
                <p className="text-sm opacity-70 mb-3">
                  Join CircleUp and start your software development journey!
                </p>
              </div>

              <div className="space-y-3">
                {/* fullname input  */}
                <div className="form-control w-full">
                  <label className="label mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-primary w-full "
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    required
                  />
                </div>
                {/* email input */}
                <div className="form-control w-full">
                  <label className="label mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="John@gmail.com"
                    className="input input-primary w-full"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
                {/* password input */}
                <div className="form-control w-full">
                  <label className="label mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-primary w-full"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account ?{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline ml-1"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* right side - image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-lg font-semibold">
                Connect with developers around the world
              </h2>
              <p className="opacity-70 text-sm">
                Join CircelUp to share your software projects, collaborate with
                others, and learn from a global community of developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
