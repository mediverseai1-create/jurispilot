import { getContext } from "@/lib/session";
import { updateProfile } from "../actions";

export default async function Settings() {
  const { user, profile } = (await getContext())!;
  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-4xl">Settings</h1>
      <form action={updateProfile} className="card p-5 space-y-3">
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" value={user.email ?? ""} disabled readOnly /></div>
        <div><label className="label" htmlFor="full_name">Full name</label><input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} maxLength={120} className="input" /></div>
        <div><label className="label" htmlFor="firm">Firm</label><input id="firm" name="firm" defaultValue={profile?.firm ?? ""} maxLength={160} className="input" /></div>
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
