import {
    LayoutDashboard,
    ClipboardList,
    BarChart3,
    Database,
    Settings,
    Search,
    MoreHorizontal
} from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">IT Admin</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-semibold border-r-4 border-blue-600 transition-all">
                        <ClipboardList className="w-5 h-5" />
                        รายการงานซ่อม
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <BarChart3 className="w-5 h-5" />
                        รายงานสถิติ
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <Database className="w-5 h-5" />
                        จัดการ Master Data
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-all">
                        <Settings className="w-5 h-5" />
                        ตั้งค่าระบบ
                    </a>
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">A</div>
                        <div className="text-sm">
                            <p className="text-white font-semibold">Admin User</p>
                            <p className="text-xs text-slate-500">IT Specialist</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">รายการงานซ่อม</h1>
                        <p className="text-slate-500">จัดการและติดตามสถานะงานซ่อมทั้งหมดในระบบ</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ค้นหา Job ID, ชื่อผู้แจ้ง..."
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 cursor-pointer">
                            Export PDF
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-amber-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">รอดำเนินการ</p>
                        <p className="text-3xl font-black text-slate-900">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-blue-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">กำลังซ่อม</p>
                        <p className="text-3xl font-black text-slate-900">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-purple-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">ส่งซ่อมภายนอก</p>
                        <p className="text-3xl font-black text-slate-900">3</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-400">
                        <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">สำเร็จแล้ว</p>
                        <p className="text-3xl font-black text-slate-900">48</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้แจ้ง / สาขา</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">อุปกรณ์ / อาการ</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Row 1 */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-blue-600">JOB2024-0021</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">นายสมชาย จดหมาย</p>
                                    <p className="text-sm text-slate-500">สาขาบางละมุง</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900 truncate max-w-xs">Printer HP LaserJet</p>
                                    <p className="text-sm text-slate-500 truncate max-w-xs">หมึกเลอะ กระดาษติดบ่อย</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold ring-1 ring-amber-200">รอดำเนินการ</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-900 transition-colors p-2 cursor-pointer">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-blue-600">JOB2024-0020</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">นางสาววิภาดา ดีงาม</p>
                                    <p className="text-sm text-slate-500">สำนักงานจังหวัด</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">Laptop Dell Latitute</p>
                                    <p className="text-sm text-slate-500">เปิดเครื่องไม่ติด มีเสียงดัง</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold ring-1 ring-blue-200">กำลังซ่อม</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-900 transition-colors p-2 cursor-pointer">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
