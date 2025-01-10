"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useResetFlow } from "@/features/auth/hooks/useResetFlow";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [maskedEmailDisplay, setMaskedEmailDisplay] = useState("");
  const { isLoading, countdown, verifyOtp, resendOtp } = useResetFlow();

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name='otp-${index - 1}']`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      await verifyOtp(otpString);
    } catch {
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
    }
  };

  useEffect(() => {
    // Check if we're on client side
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        toast.error("Please enter your email first");
        router.replace("/auth/forgot-password");
      } else {
        const [username, domain] = email.split("@");
        const maskedUsername =
          username.slice(0, 2) + "*".repeat(username.length - 2);
        setMaskedEmailDisplay(`${maskedUsername}@${domain}`);
      }
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center bg-gray-100 pt-0 md:py-12">
      <div className="bg-white md:rounded-lg shadow-lg overflow-hidden flex flex-wrap md:flex-nowrap flex-col md:flex-row max-w-[120vh] w-full min-h-[70vh]">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/auth/slider1.jpg"
            alt="keyboards"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="flex max-w-[120vh] w-full md:w-1/2 p-8 h-full min-h-[70vh]">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {maskedEmailDisplay}</p>
              </div>
            </div>

            <div>
              <form onSubmit={handleVerifyOTP}>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700 gap-2"
                          type="text"
                          maxLength={1}
                          name={`otp-${index}`}
                          value={otp[index]}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pastedData = e.clipboardData
                              .getData("text")
                              .slice(0, 6)
                              .split("");
                            const newOtp = [...otp];
                            pastedData.forEach((value, i) => {
                              if (i < 6) newOtp[i] = value;
                            });
                            setOtp(newOtp);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-orange-600 hover:bg-orange-700 border-none text-white text-sm shadow-sm ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Verifying..." : "Verify Account"}
                    </button>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn&apos;t receive code?</p>{" "}
                      <button
                        type="button"
                        onClick={resendOtp}
                        className={`flex flex-row items-center text-blue-600 hover:text-blue-900 ${
                          countdown > 0 ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={countdown > 0 || isLoading}
                      >
                        {countdown > 0
                          ? `Resend OTP in ${countdown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
