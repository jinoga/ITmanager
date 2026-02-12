"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Save,
    Loader2,
    ChevronLeft,
    Shield,
    Globe,
    FileText,
    CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function SettingsAdmin() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            if (!data.error) setSettings(data);
        } catch (error) {
            console.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings }),
            });
            if (res.ok) {
                setMessage("บันทึกการตั้งค่าเรียบร้อยแล้ว");
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <ChevronLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Settings className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold text-slate-900">ตั้งค่าระบบ (System Settings)</h1>
                        </div>
                    </div>
                    {message && (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="w-5 h-5" />
                            {message}
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6 md:p-8">
                <form onSubmit={handleSave} className="space-y-8">
                    {/* General Settings */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-50 p-2 rounded-xl">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">ข้อมูลทั่วไป (General)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อระบบ (System Name)</label>
                                <input
                                    type="text"
                                    value={settings.system_name || "IT Manager Pro"}
                                    onChange={(e) => handleChange("system_name", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="เช่น IT Manager Pro"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อหน่วยงาน (Org Name)</label>
                                <input
                                    type="text"
                                    value={settings.org_name || ""}
                                    onChange={(e) => handleChange("org_name", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="เช่น สำนักงานที่ดินจังหวัด"
                                />
                            </div>
                        </div>
                    </section>

                    {/* App Preferences */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-50 p-2 rounded-xl">
                                <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">การตั้งแอปพลิเคชัน (Preferences)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">คำนำหน้า Job ID (Prefix)</label>
                                <input
                                    type="text"
                                    value={settings.job_id_prefix || "JOB"}
                                    onChange={(e) => handleChange("job_id_prefix", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="เช่น JOB, REQ, IT"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ขนาดไฟล์สูงสุด (MB)</label>
                                <input
                                    type="number"
                                    value={settings.max_file_size || "5"}
                                    onChange={(e) => handleChange("max_file_size", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-amber-50 p-2 rounded-xl">
                                <Shield className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">ความปลอดภัย (Security)</h2>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                            <Settings className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                การเปลี่ยนรหัสผ่านผ่านหน้านี้จะแทนที่รหัสผ่านใน <code>.env</code> ชั่วคราว
                                (หากรหัสผ่านใน <code>.env</code> ถูกเปลี่ยนภายหลัง ค่าในฐานข้อมูลจะยังคงอยู่)
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่านใหม่ (Admin Password)</label>
                                <input
                                    type="password"
                                    value={settings.admin_password || ""}
                                    onChange={(e) => handleChange("admin_password", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="ทิ้งว่างไว้หากไม่ต้องการเปลี่ยน"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                            บันทึกการตั้งค่าทั้งหมด
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
