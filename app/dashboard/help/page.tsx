"use client";
import React, { useState } from "react";

const pdfs = [
  {
    title: "User Guide",
    url: "/pdf/user-guide.pdf",
  },
];

const videos = [
  // {
  //   title: "Getting Started",
  //   url: "https://www.youtube.com/embed/example1",
  // },
];

const tabs = ["PDF", "Videos"];

export default function HelpScreen() {
  const [tab, setTab] = useState<"PDF" | "Videos">("PDF");

  return (
    <div className="w-full mt-8">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full flex flex-row items-center gap-10 overflow-x-auto bg-white p-4 rounded-2xl">
          {tabs.map((name) => (
            <div
              key={name}
              className={`py-3 font-semibold cursor-pointer whitespace-nowrap ${
                name === tab
                  ? "border-b-2 border-[#0CA554] text-[#212B36]"
                  : "text-[#637381]"
              }`}
              onClick={() => setTab(name as "PDF" | "Videos")}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {tab === "PDF" &&
          (pdfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.title}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col"
                >
                  <h3 className="font-semibold mb-4">{pdf.title}</h3>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-[#0CA554] px-4 py-2 rounded-lg text-center hover:bg-[#098d48]"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No PDFs available
            </div>
          ))}

        {tab === "Videos" &&
          (videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div
                  key={video.title}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col"
                >
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src={video.url}
                      className="absolute top-0 left-0 w-full h-full rounded-lg border"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No videos available
            </div>
          ))}
      </div>
    </div>
  );
}
