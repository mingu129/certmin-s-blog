import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6EA5] via-[#5B9BD5] to-[#7DB9E8] flex items-center justify-center p-8">
      {/* Windows XP Style Window */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border-t-4 border-l-2 border-r-2 border-b-2 border-[#0831D9]">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0997FF] to-[#0831D9] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-xs font-bold text-blue-600">
              📝
            </div>
            <span className="text-white font-bold text-sm">상병 윤민규의 블로그</span>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold">_</button>
            <button className="w-6 h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold">□</button>
            <button className="w-6 h-6 bg-[#D93636] hover:bg-[#F94646] rounded-sm text-white text-xs font-bold">×</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/next.svg"
              alt="Blog Logo"
              width={180}
              height={37}
              priority
            />
            <h1 className="text-4xl font-bold text-[#003399]" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
              상병 윤민규의 블로그
            </h1>
          </div>

          <div className="bg-[#ECE9D8] border-2 border-[#003399] rounded p-4 shadow-inner">
            <Image
              src="/pilsung.png"
              alt="Blog Pilsung"
              width={720}
              height={148}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* XP Style Button */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-b from-[#EBF4FF] to-[#C1D2EE] border-2 border-[#003399] rounded px-6 py-2 shadow-md hover:from-[#FFF4E6] hover:to-[#FFE6C1] active:shadow-inner">
              <span className="font-bold text-sm text-[#003399]" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
                시작
              </span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#ECE9D8] border-t-2 border-[#DFDFDF] px-4 py-1 text-xs text-gray-700">
          Windows XP Professional
        </div>
      </div>
    </div>
  );
}
