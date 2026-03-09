"use client";
import { decrypt, getSession, login, signup } from "@/lib/lib";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangeEvent, Ref, useEffect, useRef, useState } from "react";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { useMessage, useType, useUser } from "../../app/store/zustand";
import ErrorMessage from "../Modals/ErrorMessage";
import { cleanUP } from "@/app/client-utils/functions";
import { signUpUser } from "@/supabase/supabase";
import { supabase } from "@/supabase/authHelper";

interface LoginUserForm {
  email: string;
  password: string;
  name: string;
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [errorMessage, setErrorMessage] = useState({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [counter, setCounter] = useState(0);
  const { setError, setSuccess } = useMessage();
  const { user, setUser } = useUser();
  const { changeType } = useType();
  const [otp, setOTP] = useState("");
  const [formData, setFormData] = useState<LoginUserForm>({
    email: "",
    password: "",
    name: "",
  });

  const mountSession = async () => {
    const session = await getSession();

    if (session) {
      setUser(session);
      redirect("/home");
    }
  };
  useEffect(() => {
    mountSession();
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev === 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // HANDLE LOGIN
  const handleLogin = async (formData: FormData) => {
    // const loginSession = await login(formData);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: formData.get("email"),
      options: {
       
        shouldCreateUser: false,
      },
    });
    if (error) {
      setError(true);
      return;
    }

    changeType("otp");
  };
  const hanldeOTPChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
  };
  const handleOTP = async () => {
    if (counter !== 0) return;
    console.log(formData.email);
    const {
      data: { user, session },
      error,
    } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: otp,
      type: "email",
    });
    if (user?.id) {
      setSuccess(true);
      setUser(user);
      redirect("/profile");
    }
    setError(true);
  };

  // HANDLES SIGN UP
  const handleSignUp = async (formData: FormData) => {
    const email: string = formData.get("email");
    const password: string = formData.get("password");
    const name: string = formData.get("name");
    const { data, error } = await signUpUser(email, password, name);
    
    if (error) {
      setError(true);
      return;
    }
    changeType("otp");
  };

  const toggleShowPassword = (e: MouseEvent) => {
    const inputElem: HTMLInputElement | null = inputRef.current;

    if (inputElem && inputElem.type === "password") {
      inputElem.type = "text";
      setInputType("text");
    } else if (inputElem && inputElem.type === "text") {
      inputElem.type = "password";
      setInputType("password");
    }
  };
  const handleSubmit = async (formData: FormData) => {
    switch (type) {
      case "sign-in":
        await handleLogin(formData);
        break;
      case "sign-up":
        await handleSignUp(formData);
        break;
    }
  };
  return (
    <>
      {type !== "otp" ? (
        <form
          className="mt-4 min-w-full space-y-4  flex flex-col  h-full"
          action={handleSubmit}
        >
          {type === "sign-up" && (
            <>
              <div className="flex relative text-black flex-col">
                <label className="font-bold  p-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full p-4 border text-black border-black  outline-primary"
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Name"
                />
                <span className="absolute text-secondary top-15 right-5"></span>
              </div>
            </>
          )}
          <div className="flex relative text-black flex-col">
            <label className="font-bold  p-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-4 border text-black border-black  outline-primary"
              type="text"
              name="email"
              onChange={handleChange}
              id="email"
              value={formData.email}
              placeholder="...@uvic.ca"
            />
            <span className="absolute text-secondary top-15 right-5">
              <CiMail />
            </span>
          </div>
          <div className="flex relative text-black flex-col">
            <label className="font-bold  p-2" htmlFor="email">
              Password
            </label>
            <input
              className="w-full p-4 border text-black border-black  outline-primary"
              type={inputType}
              name="password"
              id="password"
              ref={inputRef}
              onChange={handleChange}
              value={formData.password}
              placeholder="Password (Different from your UVic Passcode)"
            />
            <button
              onClick={(e) => toggleShowPassword(e)}
              type="button"
              id="view-pass"
              className="text-secondary group absolute cursor-pointer top-15 right-5"
            >
              {inputType === "text" ? <BsEyeSlash /> : <BsEye />}
              <span className="scale-0 absolute group-hover:scale-100 origin-top transition-all duration-150 bg-secondary w-max p-2  text-sm text-text -translate-x-15 translate-y-2">
                Show Password
              </span>
            </button>
          </div>
          <div className="self-center gap-2 flex  justify-center items-center ">
            <button className="bg-primary text-sm  px-4 py-2 hover:bg-secondary hover:text-white transition-all duration-150 cursor-pointer hover:scale-105">
              {type === "sign-in" ? "Sign In" : "Sign Up"}
            </button>

            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="px-4 py-2 text-sm bg-secondary "
              onClick={() =>
                changeType(type === "sign-in" ? "sign-up" : "sign-in")
              }
            >
              <span>
                {" "}
                {type === "sign-in" ? "Click to Sign Up" : "Click to Sign In"}
              </span>
            </Link>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <a href="#">
              <span className="text-secondary-dark text-sm border-b border-b-secondary-dark">
                Forgot Password
              </span>
            </a>
          </div>
        </form>
      ) : (
        <form action={handleOTP}>
          <div className="flex relative text-black flex-col">
            <label className="font-bold  p-2" htmlFor="otp">
              OTP
            </label>
            <input
              className="w-full p-4 border text-black border-black  outline-primary"
              type="text"
              name="otp"
              onChange={hanldeOTPChange}
              id="otp"
              value={otp}
              placeholder="OTP"
            />
            <span className="absolute text-secondary top-15 right-5">
              <CiMail />
            </span>
            <button>submit</button>
          </div>
          <div className="flex relative mt-4 gap-2 text-black flex-col">
            <label className="font-bold " htmlFor="otp">
              Send another OTP
            </label>
            <button
              type="button"
              className="flex gap-2 bg-primary w-fit px-2 py-1 rounded-lg text-white font-bold"
              onClick={() => {
                setCounter(60);
              }}
            >
              Resend <div>{counter}</div>
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AuthForm;
