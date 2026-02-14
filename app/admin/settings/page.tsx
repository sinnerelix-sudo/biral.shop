import { ensureStoreSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await ensureStoreSettings();
  const epMerchant = Boolean(process.env.EPOINT_MERCHANT_ID);
  const epSecret = Boolean(process.env.EPOINT_SECRET);
  return (
    <div className="card">
      <h1>Admin Parametrlər</h1>
      <p>ePoint Merchant ID: {epMerchant ? "present" : "missing"}</p>
      <p>ePoint Secret: {epSecret ? "present" : "missing"}</p>
      <form action="/api/admin/settings" method="post">
        <label><input type="checkbox" name="enableWhatsApp" defaultChecked={settings.enableWhatsApp} /> enableWhatsApp</label>
        <label><input type="checkbox" name="enableEpoint" defaultChecked={settings.enableEpoint} /> enableEpoint</label>
        <input name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="994xxxxxxxxx" />
        <textarea name="whatsappTemplate" defaultValue={settings.whatsappTemplate} />
        <button type="submit">Saxla</button>
      </form>
    </div>
  );
}
