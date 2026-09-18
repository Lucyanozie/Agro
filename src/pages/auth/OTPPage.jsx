import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { authErrorMessage, useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/utils";
import { AuthSplit } from "./AuthSplit";
const LENGTH = 6;
const RESEND_SECONDS = 45;
export function OTPPage() {
  const { loading, pendingPhone, pendingRole, confirmPhoneOtp, sendPhoneOtp } =
    useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const details = location.state ?? {};
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const inputs = useRef([]);
  useEffect(() => {
    if (!loading && !pendingPhone) navigate("/login", { replace: true });
  }, [loading, navigate, pendingPhone]);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [seconds]);
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);
  /**
   * Accepts more than one character per box so fast typing, autofill and
   * pasted codes spill into the following inputs instead of being dropped.
   */
  function setDigit(index, value) {
    const chars = value.replace(/\D/g, "");
    setError("");
    if (!chars) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      // A box that already held a digit keeps its position; the rest spill on.
      const incoming =
        chars.length > 1 && prev[index] === chars[0] ? chars.slice(1) : chars;
      for (let i = 0; i < incoming.length && index + i < LENGTH; i += 1) {
        next[index + i] = incoming[i];
      }
      return next;
    });
    const landed = Math.min(index + chars.length, LENGTH) - 1;
    inputs.current[Math.min(landed + 1, LENGTH - 1)]?.focus();
  }
  function onKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1)
      inputs.current[index + 1]?.focus();
  }
  function onPaste(e) {
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  }
  async function verify(e) {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      setError("Enter all 6 digits to continue");
      return;
    }
    setError("");
    try {
      const authenticatedUser = await confirmPhoneOtp(digits.join(""));
      navigate(
        details.mode === "register"
          ? "/account-created"
          : authenticatedUser.role === "farmer"
            ? "/farmer"
            : "/buyer",
        { replace: true },
      );
    } catch (error) {
      setError(authErrorMessage(error));
    }
  }
  async function resend() {
    try {
      await sendPhoneOtp(phone, details.mode === "register" ? details : null);
      setSeconds(RESEND_SECONDS);
      setDigits(Array(LENGTH).fill(""));
      inputs.current[0]?.focus();
      notify("A new code has been sent to your phone");
    } catch (error) {
      setError(authErrorMessage(error));
    }
  }
  const phone = details.phone || pendingPhone;
  return (
    <AuthSplit
      image={
        pendingRole === "farmer"
          ? "/img/auth-farm.jpg"
          : "/img/auth-handoff.jpg"
      }
      imageAlt="Farmers standing between rows of leafy vegetables"
      backTo="/register"
    >
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <ShieldCheck className="h-7 w-7 text-brand-600" />
        </span>
        <h1 className="mt-4 text-[28px] font-extrabold text-ink">
          OTP Verification
        </h1>
        <p className="mt-2 text-[17px] text-ink-soft">
          Enter the 6-digit code sent to
        </p>
        <p className="mt-1 text-[17px] font-bold text-ink">{phone}</p>
      </div>

      <form onSubmit={verify} className="mt-6">
        <div className="flex justify-center gap-2.5" onPaste={onPaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              className={cx(
                "h-[52px] w-[46px] rounded-lg border text-center text-[22px] font-bold text-ink transition focus:outline-none focus:ring-2 focus:ring-brand-100",
                error
                  ? "border-red-300"
                  : "border-brand-400 focus:border-brand-600",
              )}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-2 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <p className="mt-4 text-center text-[15px] text-ink">
          Didn&apos;t receive code?{" "}
          {seconds > 0 ? (
            <>
              <span className="font-bold text-brand-600">Resend OTP</span>{" "}
              <span className="text-ink-soft">
                (00:{String(seconds).padStart(2, "0")})
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={resend}
              className="font-bold text-brand-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </p>

        <Button type="submit" block className="mt-7">
          Verify
        </Button>
      </form>

      <img
        src="/img/otp-phone.png"
        alt=""
        aria-hidden="true"
        className="mx-auto mt-8 w-[190px] select-none"
      />
    </AuthSplit>
  );
}
