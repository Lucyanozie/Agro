import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { AuthSplit } from "./AuthSplit";
export function LoginPage() {
  const { isAuthed, loading, user, sendPhoneOtp } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!loading && isAuthed) {
      navigate(user.role === "farmer" ? "/farmer" : "/buyer", {
        replace: true,
      });
    }
  }, [isAuthed, loading, navigate, user]);
  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    if (isAuthed) {
      setErrors({ phone: "You are already logged in. Please sign out first." });
      return;
    }
    const next = {};
    if (!phone || !isValidPhoneNumber(phone))
      next.phone = "Enter a valid Nigerian phone number";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await sendPhoneOtp(phone);
      notify("Verification code sent");
      navigate("/otp", { state: { mode: "login", phone } });
    } catch (error) {
      setErrors({ phone: error.message || "Unable to send verification code" });
    } finally {
      setSending(false);
    }
  }
  return (
    <AuthSplit
      image="/img/auth-farm.jpg"
      imageAlt="Two farmers harvesting vegetables on their farm"
      backTo="/welcome"
      leaves
    >
      <h1 className="text-center text-[34px] font-extrabold text-ink">
        Welcome Back!
      </h1>
      <p className="mt-1 text-center text-[17px] text-ink-soft">
        Login to Continue
      </p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-4">
        <div>
          <PhoneInput
            defaultCountry="NG"
            international
            countryCallingCodeEditable={false}
            placeholder="Phone Number"
            value={phone}
            onChange={setPhone}
            className={
              errors.phone ? "phone-input phone-input-error" : "phone-input"
            }
            aria-label="Phone number"
          />
          {errors.phone ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <Button type="submit" block className="!mt-7" disabled={sending}>
          {sending ? "Sending code..." : "Send OTP"}
        </Button>

        <p className="text-center text-[15px] font-medium text-ink">
          Don&apos;t have an account?{" "}
          <Link to="/role" className="font-bold text-brand-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
      <div id="recaptcha-container" />
    </AuthSplit>
  );
}
