import { useState } from "react";
import { CheckCircle2, MessageCircle, Send, Star } from "lucide-react";
import { useShop } from "../../context/ShopContext.tsx";
import { isUgPhone, submitRequest, type RequestKind } from "../../lib/forms.ts";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "select" | "rating" | "checkbox";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  /** Takes half the row on wider screens. */
  half?: boolean;
  hint?: string;
}

const input = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20";

// One form component for every request type. Validates, sends through lib/forms.ts and shows the result.
export default function RequestForm({ kind, fields, submitLabel = "Send", initial = {} }: { kind: RequestKind; fields: Field[]; submitLabel?: string; initial?: Record<string, string> }) {
  const { business } = useShop();
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(f => [f.name, initial[f.name] ?? ""])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "whatsapp" | "error"; message?: string; url?: string }>({ status: "idle" });
  const [honey, setHoney] = useState(""); // spam trap: people never see or fill it

  const set = (name: string, v: string) => { setValues(s => ({ ...s, [name]: v })); setErrors(e => ({ ...e, [name]: "" })); };

  const validate = () => {
    const e: Record<string, string> = {};
    fields.forEach(f => {
      const v = (values[f.name] ?? "").trim();
      if (f.required && !v) e[f.name] = f.type === "rating" ? "Please choose a rating." : "Please fill this in.";
      else if (v && f.type === "tel" && !isUgPhone(v)) e[f.name] = "Use a Ugandan number, e.g. 0772 123 456.";
      else if (v && f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) e[f.name] = "That email doesn't look right.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (honey || !validate()) return;
    setState({ status: "sending" });
    const labels = Object.fromEntries(fields.map(f => [f.name, f.label]));
    const res = await submitRequest(kind, values, labels, business.whatsapp);
    if (!res.ok) setState({ status: "error", message: res.error });
    else if (res.mode === "whatsapp") { setState({ status: "whatsapp", url: res.url }); window.open(res.url, "_blank", "noopener"); }
    else setState({ status: "done", message: res.reference });
  };

  if (state.status === "done") {
    return (
      <div className="rounded-2xl bg-ok/10 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-ok" />
        <h3 className="mt-3 text-[20px] font-bold">Thank you, we've received it</h3>
        <p className="mt-1.5 text-ink-soft">Our team will call you on the number you gave.{state.message && <> Your reference is <strong className="text-ink">{state.message}</strong>.</>}</p>
      </div>
    );
  }
  if (state.status === "whatsapp") {
    return (
      <div className="rounded-2xl bg-paper p-8 text-center" role="status">
        <MessageCircle className="mx-auto h-10 w-10 text-[#1fa855]" />
        <h3 className="mt-3 text-[20px] font-bold">Almost done: press send in WhatsApp</h3>
        <p className="mt-1.5 text-ink-soft">We've written your details into a WhatsApp message to our team.</p>
        <a href={state.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-6 py-3 font-semibold text-white">Open WhatsApp again</a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} className="hidden" aria-hidden="true" />
      {fields.map(f => {
        const id = kind + "-" + f.name;
        const err = errors[f.name];
        const common = { id, name: f.name, "aria-invalid": !!err, "aria-describedby": err ? id + "-err" : undefined };
        return (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            {f.type === "checkbox" ? (
              <label className="flex items-start gap-3 text-[14.5px]">
                <input {...common} type="checkbox" checked={values[f.name] === "Yes"} onChange={e => set(f.name, e.target.checked ? "Yes" : "")} className="mt-1 h-4 w-4 accent-[var(--color-brand)]" />
                <span>{f.label}</span>
              </label>
            ) : (
              <>
                <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold">{f.label}{f.required && <span className="text-brand-dark"> *</span>}</label>
                {f.type === "textarea" ? (
                  <textarea {...common} rows={5} value={values[f.name]} onChange={e => set(f.name, e.target.value)} placeholder={f.placeholder} className={input + " resize-y"} />
                ) : f.type === "select" ? (
                  <select {...common} value={values[f.name]} onChange={e => set(f.name, e.target.value)} className={input}>
                    <option value="">Choose…</option>
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "rating" ? (
                  <div className="flex gap-1" role="radiogroup" aria-labelledby={id}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" role="radio" aria-checked={values[f.name] === String(n)} aria-label={n + (n === 1 ? " star" : " stars")} onClick={() => set(f.name, String(n))} className="p-1">
                        <Star className={"h-8 w-8 transition " + (Number(values[f.name]) >= n ? "fill-[#f5b301] text-[#f5b301]" : "text-line")} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <input {...common} type={f.type ?? "text"} inputMode={f.type === "tel" ? "tel" : undefined} autoComplete={f.type === "tel" ? "tel" : f.type === "email" ? "email" : f.name === "name" ? "name" : undefined} value={values[f.name]} onChange={e => set(f.name, e.target.value)} placeholder={f.placeholder} className={input} />
                )}
              </>
            )}
            {f.hint && !err && <p className="mt-1 text-[12.5px] text-ink-soft">{f.hint}</p>}
            {err && <p id={id + "-err"} className="mt-1 text-[13px] font-medium text-red-600">{err}</p>}
          </div>
        );
      })}
      {state.status === "error" && <p className="text-[14px] font-medium text-red-600 sm:col-span-2" role="alert">{state.message}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
          <Send className="h-4 w-4" /> {state.status === "sending" ? "Sending…" : submitLabel}
        </button>
        <p className="mt-2 text-[12.5px] text-ink-soft">We use your details only to reply to you. See our <a href="/privacy" className="underline">privacy notice</a>.</p>
      </div>
    </form>
  );
}

/** Shared field sets. */
export const CONTACT_FIELDS: Field[] = [
  { name: "name", label: "Your name", required: true, half: true },
  { name: "phone", label: "Phone number", type: "tel", required: true, half: true, placeholder: "0772 123 456" },
];
export const UG_DISTRICT_HINT = "Town or district, e.g. Kampala, Mukono, Mbarara, Gulu";
