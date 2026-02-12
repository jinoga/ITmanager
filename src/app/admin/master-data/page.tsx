"use client";

import { useState, useEffect } from "react";
import {
    Database,
    Plus,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    ChevronLeft,
    Search,
    RefreshCw
} from "lucide-react";
import Link from "next/link";

type MasterDataItem = {
    id: string;
    type: string;
    value: string;
    isActive: boolean;
};

const TYPES = [
    { label: "สาขา (Branch)", value: "branch" },
    { label: "แผนก (Dept)", value: "dept" },
    { label: "ประเภทอุปกรณ์ (Asset)", value: "asset" },
    { label: "ช่าง (Tech)", value: "tech" },
    { label: "ร้านซ่อม (Shop)", value: "shop" },
];

export default function MasterDataAdmin() {
    const [items, setItems] = useState<MasterDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("branch");
    const [newValue, setNewValue] = useState("");
    const [adding, setAdding] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/master-data?type=${selectedType}&all=true`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load master data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedType]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newValue.trim()) return;
        setAdding(true);
        try {
            const res = await fetch("/api/master-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: selectedType, value: newValue }),
            });
            if (res.ok) {
                setNewValue("");
                loadData();
            }
        } catch (error) {
            alert("Error adding item");
        } finally {
            setAdding(false);
        }
    };

    const toggleActive = async (item: MasterDataItem) => {
        try {
            await fetch("/api/master-data", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
            });
            loadData();
        } catch (error) {
            alert("Error updating item");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;
        try {
            await fetch(`/api/master-data?id=${id}`, { method: "DELETE" });
            loadData();
        } catch (error) {
            alert("Error deleting item");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <ChevronLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Database className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold text-slate-900">จัดการข้อมูลพื้นฐาน (Master Data)</h1>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Types */}
                    <div className="lg:col-span-1 space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">หมวดข้อมูล</p>
                        {TYPES.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${selectedType === type.value
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Content: Items Table */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Add Form */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <form onSubmit={handleAdd} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    placeholder={`เพิ่มรายชื่อ${TYPES.find(t => t.value === selectedType)?.label}ใหม่...`}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    disabled={adding || !newValue.trim()}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    เพิ่มข้อมูล
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                </div>
                            ) : items.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-slate-400 font-medium">ไม่มีข้อมูลในหมวดนี้</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ชื่อข้อมูล</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-32">สถานะ</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">{item.value}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleActive(item)}
                                                        className={`flex items-center gap-2 font-bold text-sm ${item.isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                                                    >
                                                        {item.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                                        {item.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
