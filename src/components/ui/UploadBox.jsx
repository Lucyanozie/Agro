import { useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cx } from "@/lib/utils";
const MAX_BYTES = 5 * 1024 * 1024;
export function UploadBox({
  title,
  subtitle,
  icon,
  value,
  onChange,
  accept = "image/png,image/jpeg,application/pdf",
  tone = "grey",
  className,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  function handleFile(file) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("That file is larger than 5MB. Please choose a smaller one.");
      return;
    }
    setError("");
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setPreview(url);
        onChange(file.name, url);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
      onChange(file.name);
    }
  }
  function clear() {
    setPreview("");
    setError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }
  const filled = Boolean(value);
  return (
    <div className={className}>
      <div
        className={cx(
          "relative flex min-h-[118px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition",
          tone === "green" ? "border-brand-300" : "border-ink-line",
          filled && "border-solid border-brand-400 bg-brand-50/60",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {filled ? (
          <>
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-ink-mute shadow-card transition hover:text-ink"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
            {preview ? (
              <img
                src={preview}
                alt="Selected file preview"
                className="mb-1 h-32 w-full max-w-xs rounded-lg bg-white object-contain p-1 ring-1 ring-brand-200"
              />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-brand-600" />
            )}
            <p className="max-w-full truncate px-2 text-sm font-semibold text-brand-700">
              {value}
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-semibold text-brand-600 underline underline-offset-2"
            >
              Replace file
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-1.5"
          >
            {icon}
            <span className="text-[15px] font-semibold text-ink">{title}</span>
            {subtitle ? (
              <span className="text-sm text-ink-mute">{subtitle}</span>
            ) : null}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
