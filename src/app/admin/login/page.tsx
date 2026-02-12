"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Wrench } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200 inline-block mb-4">
                        <Wrench className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">IT Admin Login</h1>
                    <p className="text-slate-500 mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการงานแจ้งซ่อม</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-100 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -m-8 bg-blue-500/5 w-40 h-40 rounded-full blur-3xl"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                    placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-red-600 text-sm font-semibold text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    กำลังตรวจสอบ...
                                </>
                            ) : (
                                "เข้าสู่ระบบ"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    &copy; 2025 IT Service Management System
                </p>
            </div>
        </div>
    );
}
