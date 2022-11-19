/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { BookmarkIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { format } from "timeago.js";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useSession } from "next-auth/react";

function parseImage(thumb: any) {
  let width = 600;
  let height = 400;
  const tb = thumb[0] || null;

  if (tb && tb.width) {
    width = tb?.width;
    height = tb?.height;
  }

  let url = tb?.url?.replace(
    "#DH_EMB_IMG_REP#__DHQ_",
    `${width}x${height}__90`
  );
  return url;
}

function cloneImage(
  image: HTMLImageElement | null,
  imageConatiner: HTMLDivElement | null
) {
  if (image) {
    const clonedImage = image.cloneNode(true) as HTMLImageElement;
    imageConatiner?.appendChild(clonedImage);
  }
}

function News({ data }: any) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageConatiner = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [speading, setSpeaking] = useState(false);

  const speak = (str: string) => {
    try {
      const synth = window.speechSynthesis;
      let utterance = new SpeechSynthesisUtterance(str);
      synth.speak(utterance);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = async () => {
    if (session) {
      try {
        const content = JSON.stringify({
          title: data.title,
          sourceProvidedContentUrl: data.sourceProvidedContentUrl,
          thumbnailInfos: data.thumbnailInfos,
          content: data.content,
          timesAgo: data.timesAgo,
          source: {
            badgeType: data.source.badgeType,
            displayName: data.source.displayName,
          },
        });
        const body = JSON.stringify({
          email: session.user?.email,
          content,
        });

        const response = await fetch(`${process.env.SERVER_URL}/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        const json = await response.json();

        if (json.success) {
          setBookmarked(true);
        }
      } catch (err) {
        setBookmarked(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>News App - content at your finger tips</title>
      </Head>

      <div className="fixed bottom-28 left-4 w-full z-40">
        <a
          href="#_"
          className="relative px-6 py-3 font-bold text-black group"
          onClick={() => speak(data.content)}
        >
          <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-red-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <span className="absolute inset-0 w-full h-full border-4 border-black"></span>
          <span className="relative">Read news</span>
        </a>
      </div>
      <div className="w-screen mobile-height sm:w-[800px]">
        <div
          ref={imageConatiner}
          className="w-full h-full flex justify-center items-center relative"
        >
          <div className="absolute w-full h-full "></div>
          <img
            ref={imageRef}
            loading="lazy"
            src={parseImage(data.thumbnailInfos)}
            alt={data.title}
            className="w-full h-full object-cover blur-2xl brightness-50 absolute top-0 left-0 opacity-60"
          />
          <div className="relative text-slate-300 z-10">
            <h1 className="text-xl p-3 text-slate-100 ">
              <span className="line-clamp-3">{data.title}</span>
            </h1>

            <img
              src={parseImage(data.thumbnailInfos)}
              alt={data.title}
              loading="lazy"
              className="w-full aspect-video"
              onClick={() => speak(data.content)}
            />

            {/* News Content */}
            <p className="p-3">
              <span className="line-clamp-5 text-base inline pr-1">
                {data.content}
              </span>
            </p>

            {/* Author */}
            <div className="text-slate-500 px-3 pb-5 text-xs">
              <span>{data.source.displayName + " "}</span>
              {data.source.badgeType === "VERIFIED" ? (
                <span>
                  <CheckBadgeIcon className="w-4 h-4 inline-block" />{" "}
                </span>
              ) : (
                <span>{" • "}</span>
              )}

              <span>{format(new Date(data.timesAgo))}</span>
              <a
                href={data.sourceProvidedContentUrl || "#"}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4 inline-block ml-2" />
              </a>
              {bookmarked ? (
                <BookmarkIcon className="w-5 h-5 ml-4 inline-block" />
              ) : (
                <a href={`${session ? "#" : "#login"}`}>
                  <BookmarkOutlineIcon
                    onClick={handleBookmark}
                    className="cursor-pointer w-5 h-5 ml-4 inline-block"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default News;
