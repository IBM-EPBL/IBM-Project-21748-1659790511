import { BookmarkSquareIcon, HomeIcon, TicketIcon } from "@heroicons/react/24/solid";

import { useRouter } from "next/router";
import ChooseTopic from "./chooseTopic";

export default function BottomNav({ swiperRef }: any) {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      // @ts-ignore
      swiperRef?.slideTo(0);
      refreshData();
    }

    router.push("/");
  };

  const handleBookamrkClick = () => {
    if (window.location.pathname === "/bookmarks") {
      // @ts-ignore
      swiperRef?.slideTo(0);
      refreshData();
    }

    router.push("/bookmarks");
  };
  return (
    <div style={{ left: '182px', top: '250px', flexWrap: 'wrap', height: '100%', width: '120px'}} className="fixed  sm:transform sm:translate-x-[-10.99rem] sm:w-[100%] z-20 bottom-0 sm:bottom-[0px] h-20 w-full  opacity-90">
      <div className="flex flex-row flex-wrap justify-center gap-12 ">
        <div
          onClick={handleHomeClick}
          className="flex items-center flex-col cursor-pointer pt-4 mb-4 text-black"
          data-tip="Home"
        >
          <HomeIcon className="h-5 w-5  text-white" />
          <p className="text-slate-500 text-xs mt-1">Headlines</p>
        </div>
        <div
          onClick={handleBookamrkClick}
          className="flex items-center flex-col cursor-pointer pt-4 mb-4 text-black"
          data-tip="Bookmarks"
        >
          <TicketIcon className="h-5 w-5 text-black" />
          <p className="text-slate-400 text-xs mt-1">Saved Topics</p>
        </div>
        <ChooseTopic swiperRef={swiperRef} />
      </div>
    </div>
  );
}
