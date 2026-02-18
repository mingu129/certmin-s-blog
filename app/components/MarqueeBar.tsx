'use client';

export default function MarqueeBar() {
  const text =
    '✦ 환영합니다! WELCOME TO MY AWESOME HOMEPAGE! ✦' +
    '\u00a0\u00a0\u00a0\u00a0\u00a0 ⭐ 상병 윤민규의 개인 홈페이지 ⭐' +
    '\u00a0\u00a0\u00a0\u00a0\u00a0 🌟 BEST VIEWED IN 800×600 WITH NETSCAPE NAVIGATOR 🌟' +
    '\u00a0\u00a0\u00a0\u00a0\u00a0 ✦ 방문해 주셔서 감사합니다! THANKS 4 VISITING! ✦' +
    "\u00a0\u00a0\u00a0\u00a0\u00a0 💫 YOU ARE VISITOR #004269 💫" +
    "\u00a0\u00a0\u00a0\u00a0\u00a0 ✦ DON'T FORGET TO SIGN MY GUESTBOOK! ✦" +
    '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

  return (
    <div className="top-marquee">
      <div style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        animation: 'marquee-run 30s linear infinite',
        paddingLeft: '100%',
      }}>
        {text}
      </div>
      <style>{`
        @keyframes marquee-run {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
