import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
export function ProfileSettingsPage() {
  const { user, updateUser } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [errors, setErrors] = useState({});
  const avatarInputRef = useRef(null);
  if (!user) return null;
  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ avatar: String(reader.result) });
      notify("Profile photo updated");
    };
    reader.readAsDataURL(file);
  }
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;
    updateUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location,
    });
    notify("Profile updated");
    navigate("/buyer/account");
  }
  return (
    <>
      <PageHeader title="Profile Settings" backTo="/buyer/account" />

      <form
        onSubmit={submit}
        noValidate
        className="mx-auto w-full max-w-xl px-4 pb-12 lg:px-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-[104px] w-[104px] rounded-full object-cover"
              />
            ) : (
              <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <User className="h-10 w-10" />
              </span>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white transition hover:bg-brand-700"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="mt-7 space-y-5">
          <TextField
            shape="pill"
            label={<span className="text-ink-soft">Full Name</span>}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            shape="pill"
            type="email"
            label={<span className="text-ink-soft">Email</span>}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            shape="pill"
            type="tel"
            label={<span className="text-ink-soft">Phone Number</span>}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <TextField
            shape="pill"
            label={<span className="text-ink-soft">Location</span>}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => notify("Notification preferences are coming soon")}
          className="mt-7 flex w-full items-center justify-between gap-4 text-left"
        >
          <span>
            <span className="block text-[15px] font-bold text-ink">
              Notification Preference
            </span>
            <span className="block text-[17px] text-ink-soft">
              Manage notifications
            </span>
          </span>
          <svg
            viewBox="0 0 20 20"
            className="h-6 w-6 shrink-0 text-ink-soft"
            aria-hidden="true"
          >
            <path
              d="M7.5 4.5 13 10l-5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Button type="submit" block className="mt-7">
          Save Changes
        </Button>
      </form>
    </>
  );
}
