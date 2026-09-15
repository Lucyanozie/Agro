import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, FilePlus2, User } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { UploadBox } from '@/components/ui/UploadBox';
import { VerificationLayout } from './VerificationLayout';
export function IdentityVerification() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const form = state.identity;
    const [errors, setErrors] = useState({});
    function submit(e) {
        e.preventDefault();
        const next = {};
        if (!/^\d{11}$/.test(form.nin.replace(/\D/g, '')))
            next.nin = 'Enter your 11-digit NIN';
        if (!form.documentName)
            next.document = 'Upload a photo of your ID document';
        if (!form.selfieName)
            next.selfie = 'Add a selfie so we can match it to your ID';
        setErrors(next);
        if (Object.keys(next).length)
            return;
        update('identity', { done: true });
        navigate('/farmer/verify/address');
    }
    return (<VerificationLayout step={3} title="Verify Your Identity" subtitle="Enter your identity details and take a selfie" backTo="/farmer/verify/profile" footer={<Button block type="submit" form="identity-form">
          Next
        </Button>}>
      <form id="identity-form" onSubmit={submit} noValidate className="space-y-5">
        <TextField shape="pill" label="Identity Number" placeholder="Enter 11-digit NIN" inputMode="numeric" maxLength={11} value={form.nin} onChange={(e) => update('identity', { nin: e.target.value.replace(/\D/g, '') })} error={errors.nin}/>

        <div>
          <h2 className="text-center text-[17px] font-bold text-ink">Upload identity Documents</h2>
          <p className="mt-0.5 text-center text-[15px] text-ink-soft">
            National ID, Voters Card or International Passport
          </p>
          <UploadBox className="mt-3" icon={<FilePlus2 className="h-9 w-9 text-brand-600"/>} title="Tap to Upload" subtitle="PNG,JPG or PDF (Max 5MB)" value={form.documentName} onChange={(name) => update('identity', { documentName: name })}/>
          {errors.document ? (<p className="mt-1 text-xs font-medium text-red-600">{errors.document}</p>) : null}
        </div>

        <div>
          <h2 className="text-center text-[17px] font-bold text-ink">Take a selfie</h2>
          <p className="mt-0.5 text-center text-[15px] text-ink-soft">
            Take a clear selfie of yourself
          </p>
          <UploadBox className="mt-3" accept="image/*" icon={<span className="relative inline-flex">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-line/70">
                  <User className="h-8 w-8 text-ink-mute"/>
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 ring-2 ring-white">
                  <Camera className="h-4 w-4 text-white"/>
                </span>
              </span>} title="Tap to capture profile" value={form.selfieName} onChange={(name) => update('identity', { selfieName: name })}/>
          {errors.selfie ? (<p className="mt-1 text-xs font-medium text-red-600">{errors.selfie}</p>) : null}
        </div>

        <section className="rounded-xl border border-brand-100 bg-brand-50/70 p-4">
          <h3 className="text-[15px] font-bold text-ink">How it works</h3>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[15px] text-ink">
            <li>we&apos;ll compare your ID photo with selfie</li>
            <li>Make sure your face is clearly visible</li>
          </ul>
        </section>
      </form>
    </VerificationLayout>);
}
