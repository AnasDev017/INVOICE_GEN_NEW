import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, AlertTriangle, Key, RotateCcw } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/apiConstant.js";
// Main App Component
const App = () => {
  // State for the 6 digits (array of strings)
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  // State for messages (success/error)
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30); // 30 seconds cooldown
  const navigate = useNavigate();

  // Array of refs for the input fields for easy focus management
  const inputRefs = useRef([]);

  // Runs the resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0 && !isLoading) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown, isLoading]);

  // Handle single digit input and move focus
  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Only allow single digit
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus to the next input field
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      // If the last digit is entered, submit the code immediately
      if (index === 5 && value !== "") {
        handleVerify(newCode.join(""));
      }
    }
  };

  // Handle key down events (backspace, arrow keys)
  const handleKeyDown = (e, index) => {
    // Move to the previous input field on Backspace if current field is empty
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Clear current field and move to previous on Backspace if field has content
    else if (e.key === "Backspace" && code[index] !== "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
    // Handle arrow keys for navigation
    else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste operation (for quickly pasting a code)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").trim();
    // Check if the pasted data is exactly 6 digits
    if (/^\d{6}$/.test(pasteData)) {
      e.preventDefault();
      const newCode = pasteData.split("");
      setCode(newCode);
      inputRefs.current[5].focus(); // Focus on the last input after pasting
      handleVerify(pasteData);
    } else if (pasteData.length > 0) {
      e.preventDefault();
      setMessage("Invalid paste: Please paste exactly 6 digits.");
      setIsSuccess(false);
    }
  };
  
  // Simulate API call for verification
  const handleVerify = (fullCode) => {
    if (fullCode.length !== 6) {
      setMessage("Please enter the complete 6-digit code.");
      setIsSuccess(false);
      return;
    }

    setMessage("");
    setIsLoading(true);
    
    // Simulated network delay
    setTimeout(async () => {
      setIsLoading(false);
      
      // Simple verification logic (e.g., hardcoded correct code for demo)
      const res = await axios.post(
        `${baseUrl}/auth/verifyEmailCode`,
        { fullCode }
      );
      if (res.data.success) {
        setMessage("Verification successful! You are now logged in.");
        setIsSuccess(true);
        navigate("/login")
      } else {
        setMessage("Invalid code. Please check the code and try again.");
        setIsSuccess(false);
        // Clear the code input on failure
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    }, 1500);
  };

  // Simulate resend email action
  const handleResend = () => {
    if (resendCooldown > 0) return;

    setMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setMessage("A new verification code has been sent to your email.");
      setIsSuccess(true);
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    }, 1500);
  };

  const fullCode = code.join("");
  const isCodeComplete = fullCode.length === 6;
  const isResendDisabled = resendCooldown > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 sm:p-12 border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col items-center border-b pb-6 mb-8">
          <Key className="w-10 h-10 text-gray-900 mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Account Verification
          </h1>
          <p className="mt-2 text-lg text-gray-600 text-center">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(fullCode);
          }}
          className="space-y-6"
        >
          {/* Input Fields */}
          <div
            className="flex justify-center space-x-2 sm:space-x-3"
            onPaste={handlePaste}
            aria-label="Verification Code Input"
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLoading || isSuccess}
                className={`
                  w-10 h-14 sm:w-12 sm:h-16 text-center text-3xl font-bold 
                  text-gray-900 border-2 border-gray-300 rounded-lg 
                  focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 
                  transition duration-150 ease-in-out bg-white 
                  ${
                    fullCode.length > 0 && digit === ""
                      ? "border-gray-900/50"
                      : ""
                  }
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                `}
                style={{ caretColor: "transparent" }} // Hide cursor for cleaner look
              />
            ))}
          </div>

          {/* Message Area */}
          {message && (
            <div
              className={`p-3 rounded-lg flex items-center space-x-3 border ${
                isSuccess
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Verification Button */}
          <button
            type="submit"
            disabled={!isCodeComplete || isLoading || isSuccess}
            className={`
              w-full py-3 mt-6 rounded-lg text-white text-lg font-semibold 
              transition duration-200 
              ${
                isCodeComplete && !isLoading && !isSuccess
                  ? "bg-gray-900 hover:bg-gray-700 shadow-md"
                  : "bg-gray-400 cursor-not-allowed"
              }
              ${isLoading ? "flex items-center justify-center" : ""}
            `}
            onClick={() => handleVerify(fullCode)}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : isSuccess ? (
              "Verified!"
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={isResendDisabled || isLoading || isSuccess}
            className={`flex items-center justify-center mx-auto text-sm font-medium 
                    ${
                      isResendDisabled || isLoading || isSuccess
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
          >
            <RotateCcw
              className={`w-4 h-4 mr-2 ${
                !isResendDisabled && "animate-spin-once"
              }`}
            />
            {isResendDisabled
              ? `Resend Code in ${resendCooldown}s`
              : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
