import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { cx } from "@/lib/utils";
import { AuthSplit } from "./AuthSplit";
export function RegisterPage() {
  const { isAuthed, loading, pendingRole, pendingMode, sendPhoneOtp, user } =
    useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Skip the auto-redirect when this session's auth came from a
    // registration that just completed — the OTP step already sends the
    // user to /account-created, which owns what happens next. Without
    // this check, landing back on /register (e.g. a back-button press)
    // right after registering would bounce the user straight past that
    // success screen into their dashboard.
    if (!loading && isAuthed && pendingMode !== "register") {
      navigate(user.role === "farmer" ? "/farmer" : "/buyer", {
        replace: true,
      });
    }
  }, [isAuthed, loading, navigate, pendingMode, user]);
  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (!phone || !isValidPhoneNumber(phone))
      next.phone = "Enter a valid Nigerian phone number";
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address";
    if (!agreed) next.terms = "Please accept the terms to continue";
    return next;
  }
  async function submit(e) {
    e.preventDefault();
    if (loading || isAuthed) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await sendPhoneOtp(phone, { name, phone, email });
      navigate("/otp", { state: { mode: "register", name, phone, email } });
    } catch (error) {
      setErrors({ phone: error.message || "Unable to send verification code" });
    } finally {
      setSending(false);
    }
  }
  return (
    <AuthSplit
      image={
        pendingRole === "farmer"
          ? "/img/auth-farm.jpg"
          : "/img/auth-handoff.jpg"
      }
      imageAlt={
        pendingRole === "farmer"
          ? "Farmers standing between rows of leafy vegetables"
          : "A buyer receiving fresh greens from a farmer at a market stall"
      }
      backTo="/role"
    >
      <div className="text-center">
        <h1 className="text-[34px] font-extrabold leading-tight text-ink">
          Create Account
        </h1>
        <p className="mt-1 text-[17px] text-ink-soft">
          Fill in your details to get started
        </p>
      </div>

      <form onSubmit={submit} noValidate className="mt-7 space-y-4">
        <TextField
          shape="pill"
          placeholder="User Name"
          autoComplete="name"
          icon={<User className="h-[18px] w-[18px]" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          aria-label="User name"
        />
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
        <TextField
          shape="pill"
          type="email"
          placeholder="Email (optional)"
          autoComplete="email"
          icon={<Mail className="h-[18px] w-[18px]" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          aria-label="Email"
        />
        <div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[17px] text-ink">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className={cx(
                "h-5 w-5 shrink-0 cursor-pointer rounded border-2 accent-brand-600",
                errors.terms ? "border-red-400" : "border-brand-400",
              )}
            />
            <span>
              I agree to the{" "}
              <span className="font-medium text-brand-600 underline-offset-2 hover:underline">
                Terms and Conditions
              </span>
            </span>
          </label>
          {errors.terms ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.terms}
            </p>
          ) : null}
        </div>

        <Button type="submit" block className="!mt-8" disabled={sending}>
          {sending ? "Sending code..." : "Create Account"}
        </Button>

        <p className="text-center text-[17px] text-ink">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-brand-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
      <div id="recaptcha-container" />
    </AuthSplit>
  );
}