import { useId, useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { cx } from '@/lib/utils';
export function FieldWrap({ label, hint, error, className, children, htmlFor }) {
    return (<div className={cx('w-full', className)}>
      {label ? (<label htmlFor={htmlFor} className="mb-1.5 block text-[15px] font-semibold text-ink">
          {label}
        </label>) : null}
      {children}
      {error ? (<p className="mt-1 text-xs font-medium text-red-600">{error}</p>) : hint ? (<p className="mt-1 text-xs text-ink-mute">{hint}</p>) : null}
    </div>);
}
export function TextField({ label, hint, error, icon, wrapClassName, shape = 'box', className, id, ...rest }) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const isPassword = rest.type === 'password';
    const [reveal, setReveal] = useState(false);
    return (<FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <div className="relative">
        {icon ? (<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute">
            {icon}
          </span>) : null}
        <input id={fieldId} {...rest} type={isPassword && reveal ? 'text' : rest.type} className={cx(shape === 'pill' ? 'field' : 'field-box', icon ? 'pl-11' : null, isPassword ? 'pr-11' : null, error && 'border-red-300 focus:border-red-400 focus:ring-red-100', className)}/>
        {isPassword ? (<button type="button" onClick={() => setReveal((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-mute transition hover:text-ink" aria-label={reveal ? 'Hide password' : 'Show password'}>
            {reveal ? <Eye className="h-[18px] w-[18px]"/> : <EyeOff className="h-[18px] w-[18px]"/>}
          </button>) : null}
      </div>
    </FieldWrap>);
}
export function SelectField({ label, hint, error, options, placeholder = 'Select', wrapClassName, shape = 'box', className, id, value, ...rest }) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (<FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <div className="relative">
        <select id={fieldId} value={value} {...rest} className={cx(shape === 'pill' ? 'field' : 'field-box', 'appearance-none pr-10', !value && 'text-ink-mute', error && 'border-red-300', className)}>
          <option value="">{placeholder}</option>
          {options.map((o) => (<option key={o} value={o} className="text-ink">
              {o}
            </option>))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-mute"/>
      </div>
    </FieldWrap>);
}
export function TextAreaField({ label, hint, error, wrapClassName, className, id, ...rest }) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (<FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <textarea id={fieldId} {...rest} className={cx('field-box min-h-[104px] resize-none leading-relaxed', className)}/>
    </FieldWrap>);
}
