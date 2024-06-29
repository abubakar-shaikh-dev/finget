import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    const registerPromise = axiosInstance.post("/user/auth/login", data);

    toast
      .promise(registerPromise, {
        loading: "Please Wait...",
        success: (res) => {
          localStorage.setItem("token", res.data.data.token);
          navigate("/dashboard");
          return "Login successful";
        },
        error: (err) => err.response.data.message,
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">FINGET</h1>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Login to your account
              </h2>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("email", { required: true })}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          Email field is required
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("password", {
                          required: true,
                        })}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          Password field is required
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className={`flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        loading
                          ? "cursor-not-allowed bg-indigo-300 hover:bg-indigo-300"
                          : "cursor-pointer"
                      }`}
                    >
                      {loading ? "Loading..." : "Login"}
                    </button>
                  </div>
                  <div className="text-sm text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
