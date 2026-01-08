import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6EA5] via-[#5B9BD5] to-[#7DB9E8] flex items-center justify-center p-4 md:p-8">
      {/* Windows XP Style Window */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl md:max-w-3xl overflow-hidden border-t-4 border-l-2 border-r-2 border-b-2 border-[#0831D9]">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0997FF] to-[#0831D9] px-2 md:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-sm flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
              📝
            </div>
            <span className="text-white font-bold text-xs md:text-sm truncate">상병 윤민규의 블로그</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold flex-shrink-0">_</button>
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold flex-shrink-0">□</button>
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#D93636] hover:bg-[#F94646] rounded-sm text-white text-xs font-bold flex-shrink-0">×</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <h1 className="text-2xl md:text-4xl font-bold text-[#003399] text-center">
              상병 윤민규의 블로그
            </h1>
          </div>

          <div className="bg-[#ECE9D8] border-2 border-[#003399] rounded p-2 md:p-4 shadow-inner">
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
            <Link href="/blog">
              <button className="bg-gradient-to-b from-[#EBF4FF] to-[#C1D2EE] border-2 border-[#003399] rounded px-4 md:px-6 py-1 md:py-2 shadow-md hover:from-[#FFF4E6] hover:to-[#FFE6C1] active:shadow-inner">
                <span className="font-bold text-xs md:text-sm text-[#003399]">
                  블로그 보기
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#ECE9D8] border-t-2 border-[#DFDFDF] px-2 md:px-4 py-1 text-xs text-gray-700 overflow-x-auto">
          Windows XP Professional
        </div>
      </div>
    </div>
  );
}
