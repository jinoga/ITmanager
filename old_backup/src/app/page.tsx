"use client";

import { useState, useEffect } from "react";
import { Wrench, Camera, CheckCircle, Loader2 } from "lucide-react";

type MasterDataItem = { id: string; type: string; value: string };

export default function Home() {
  const [branches, setBranches] = useState<MasterDataItem[]>([]);
  const [departments, setDepartments] = useState<MasterDataItem[]>([]);
  const [assetTypes, setAssetTypes] = useState<MasterDataItem[]>([]);

  const [form, setForm] = useState({
    requester: "",
    branch: "",
    dept: "",
    assetType: "",
    assetName: "",
    issue: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Load master data on mount
  useEffect(() => {
    async function loadMasterData() {
      try {
        const [branchRes, deptRes, assetRes, settingsRes] = await Promise.all([
          fetch("/api/master-data?type=branch"),
          fetch("/api/master-data?type=dept"),
          fetch("/api/master-data?type=asset"),
          fetch("/api/settings"),
        ]);
        const branchData = await branchRes.json();
        const deptData = await deptRes.json();
        const assetData = await assetRes.json();
        const settingsData = await settingsRes.json();

        setBranches(Array.isArray(branchData) ? branchData : []);
        setDepartments(Array.isArray(deptData) ? deptData : []);
        setAssetTypes(Array.isArray(assetData) ? assetData : []);
        if (settingsData && !settingsData.error) setSettings(settingsData);

        // Set default values
        if (Array.isArray(branchData) && branchData.length > 0) setForm(f => ({ ...f, branch: branchData[0].value }));
        if (Array.isArray(deptData) && deptData.length > 0) setForm(f => ({ ...f, dept: deptData[0].value }));
        if (Array.isArray(assetData) && assetData.length > 0) setForm(f => ({ ...f, assetType: assetData[0].value }));
      } catch {
        // If master data fails, use hardcoded defaults
        setBranches([
          { id: "1", type: "branch", value: "สำนักงานที่ดินจังหวัด" },
          { id: "2", type: "branch", value: "สาขาบางละมุง" },
          { id: "3", type: "branch", value: "สาขาศรีราชา" },
        ]);
        setDepartments([
          { id: "4", type: "dept", value: "ฝ่ายทะเบียน" },
          { id: "5", type: "dept", value: "ฝ่ายรังวัด" },
          { id: "6", type: "dept", value: "ฝ่ายจัดการ" },
        ]);
        setAssetTypes([
          { id: "7", type: "asset", value: "Computer / Laptop" },
          { id: "8", type: "asset", value: "Printer / Scanner" },
          { id: "9", type: "asset", value: "Network / Wi-Fi" },
          { id: "10", type: "asset", value: "Software / OS" },
        ]);
        setForm(f => ({
          ...f,
          branch: "สำนักงานที่ดินจังหวัด",
          dept: "ฝ่ายทะเบียน",
          assetType: "Computer / Laptop",
        }));
      }
    }
    loadMasterData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = "";
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) imageUrl = uploadData.url;
        setUploading(false);
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          assetName: form.assetType,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      setSuccess(`บันทึกสำเร็จ! หมายเลขงาน: ${data.jobId}`);
      setForm(f => ({
        ...f,
        requester: "",
        issue: "",
        assetName: "",
      }));
      setImageFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Wrench className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">{settings.system_name || "IT Manager Pro"}</span>
        </div>
        <div className="flex gap-4">
          <a href="/admin" className="bg-slate-900 text-white px-5 py-2 rounded-full font-semibold shadow-xl shadow-slate-200 hover:scale-105 transition-transform">
            Admin
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-12 px-6 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">ยินดีต้อนรับสู่ {settings.system_name || "IT Service Desk"}</h1>
          <p className="text-slate-500 text-lg">{settings.org_name || "เราพร้อมดูแลอุปกรณ์และระบบของคุณให้กลับมาทำงานได้ดีที่สุด"}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-emerald-800 font-semibold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-blue-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -m-4 bg-blue-500/10 w-32 h-32 rounded-full blur-3xl"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ผู้แจ้ง (Requester)</label>
                <input
                  type="text"
                  required
                  value={form.requester}
                  onChange={e => setForm(f => ({ ...f, requester: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  placeholder="ระบุชื่อจริง-นามสกุล"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">สาขา (Branch)</label>
                <select
                  value={form.branch}
                  onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.value}>{b.value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">แผนก (Department)</label>
                <select
                  value={form.dept}
                  onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.value}>{d.value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ประเภทอุปกรณ์</label>
                <select
                  value={form.assetType}
                  onChange={e => setForm(f => ({ ...f, assetType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assetTypes.map(a => (
                    <option key={a.id} value={a.value}>{a.value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">อาการเสีย / รายละเอียด</label>
              <textarea
                rows={4}
                required
                value={form.issue}
                onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300"
                placeholder="อธิบายปัญหาที่พบเบื้องต้น..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">รูปภาพประกอบ (Optional)</label>
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <Camera className="w-8 h-8 mx-auto text-slate-400 group-hover:text-blue-500 mb-2" />
                <p className="text-slate-500 group-hover:text-blue-600 font-medium">
                  {imageFile ? `ไฟล์ที่เลือก: ${imageFile.name}` : "คลิกเพื่ออัปโหลดรูปภาพ"}
                </p>
                <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG (สูงสุด 5MB)</p>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploading ? "กำลังอัปโหลดรูปภาพ..." : "กำลังบันทึก..."}
                </>
              ) : (
                "บันทึกข้อมูลและส่งแจ้งซ่อม"
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
