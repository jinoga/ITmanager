import { Wrench, Camera } from "lucide-react";

export default function Home() {
  return (
    <>
      <nav className="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Wrench className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">IT Manager Pro</span>
        </div>
        <div className="flex gap-4">
          <button className="text-slate-500 hover:text-blue-600 transition-colors font-medium">ติดตามสถานะ</button>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-semibold shadow-xl shadow-slate-200 hover:scale-105 transition-transform">แจ้งซ่อมใหม่</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-12 px-6 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">ยินดีต้อนรับสู่ IT Service Desk</h1>
          <p className="text-slate-500 text-lg">เราพร้อมดูแลอุปกรณ์และระบบของคุณให้กลับมาทำงานได้ดีที่สุด</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-blue-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -m-4 bg-blue-500/10 w-32 h-32 rounded-full blur-3xl"></div>

          <form className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ผู้แจ้ง (Requester)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300" placeholder="ระบุชื่อจริง-นามสกุล" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">สาขา (Branch)</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>สำนักงานที่ดินจังหวัด</option>
                  <option>สาขาบางละมุง</option>
                  <option>สาขาศรีราชา</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">แผนก (Department)</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>ฝ่ายทะเบียน</option>
                  <option>ฝ่ายรังวัด</option>
                  <option>ฝ่ายจัดการ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ประเภทอุปกรณ์</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Computer / Laptop</option>
                  <option>Printer / Scanner</option>
                  <option>Network / Wi-Fi</option>
                  <option>Software / OS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">อาการเสีย / รายละเอียด</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300" placeholder="อธิบายปัญหาที่พบเบื้องต้น..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">รูปภาพประกอบ (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                <Camera className="w-8 h-8 mx-auto text-slate-400 group-hover:text-blue-500 mb-2" />
                <p className="text-slate-500 group-hover:text-blue-600 font-medium">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG (สูงสุด 5MB)</p>
              </div>
            </div>

            <button type="button" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all text-lg cursor-pointer">
              บันทึกข้อมูลและส่งแจ้งซ่อม
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
