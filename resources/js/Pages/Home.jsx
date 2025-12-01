import { usePage, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Clock } from "lucide-react";
import Layout_User from "../Layouts/Layout_User";
import Layout_Guest from "../Layouts/Layout_Guest";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/Components/ui/accordion";

import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
    const {
        auth,
        featuredCampaign,
        recommendedCampaigns,
        categories,
        recommendedArticles,
    } = usePage().props;

    const Layout = auth.user ? Layout_User : Layout_Guest;
    const [likedCampaigns, setLikedCampaigns] = useState({});

    const [page, setPage] = useState(1);
    const campaignsPerPage = 6;
    const startIndex = (page - 1) * campaignsPerPage;
    const paginatedCampaigns = recommendedCampaigns?.slice(
        startIndex,
        startIndex + campaignsPerPage
    );
    // 🔹 Kelompokkan campaign berdasarkan kategori
    const groupedCampaigns = categories.map((cat) => {
        const catCampaigns = recommendedCampaigns
            .filter((c) => c.category === cat.lookup_value)
            .sort(() => 0.5 - Math.random()) // random urutan
            .slice(0, 3); // ambil 2 saja

        return {
            name: cat.lookup_value,
            campaigns: catCampaigns,
        };
    });

    const handleLike = async (campaignId) => {
        try {
            const res = await fetch(`/campaigns/toggleLike`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ campaign_id: campaignId }),
            });

            // 🟣 Kalau belum login, redirect
            if (res.status === 401) {
                window.location.href = "login";
                return;
            }

            const data = await res.json();

            // 🟣 Update UI lokal
            setLikedCampaigns((prev) => ({
                ...prev,
                [campaignId]: data.isLiked,
            }));

            // 🟣 Update langsung featured count
            if (featuredCampaign.id === campaignId) {
                featuredCampaign.likes_count = data.isLiked
                    ? (featuredCampaign.likes_count || 0) + 1
                    : (featuredCampaign.likes_count || 0) - 1;
            }
        } catch (error) {
            console.error("Error liking campaign:", error);
        }
    };

    //Manual styling for swiper
    const customSwiperStyle = `
  .swiper {
    padding-bottom: 3rem !important; /* 48px di layar normal */
  }

  /* 🟣 Pagination styling umum */
  .swiper-pagination {
    position: relative !important;
    margin-top: 1.25rem !important; /* 20px */
    text-align: center !important;
  }

  /* 🟣 Bullet warna dan transisi */
  .swiper-pagination-bullet {
    background-color: #a855f7 !important; /* purple-500 */
    opacity: 0.5;
    transition: all 0.25s ease;
  }

  .swiper-pagination-bullet-active {
    background-color: #7e22ce !important; /* purple-700 */
    opacity: 1;
    transform: scale(1.2);
  }

  /* 🟣 Tombol panah */
  .swiper-button-next,
  .swiper-button-prev {
    color: #7e22ce !important;
    transition: transform 0.25s ease, color 0.25s ease;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    color: #a855f7 !important;
    transform: scale(1.1);
  }

  /* 🟣 Responsif: layar kecil → bullet lebih kecil, padding lebih tipis */
  @media (max-width: 768px) {
    .swiper {
      padding-bottom: 2rem !important; /* 32px di tablet/HP */
    }

    .swiper-pagination {
      margin-top: 0.75rem !important; /* 12px */
    }

    .swiper-pagination-bullet {
      width: 6px !important;
      height: 6px !important;
    }
  }

  /* 🟣 Responsif: layar besar → spacing lebih lega */
  @media (min-width: 1280px) {
    .swiper {
      padding-bottom: 4rem !important; /* 64px */
    }

    .swiper-pagination {
      margin-top: 2rem !important; /* 32px */
    }
  }
`;

    return (
        <Layout>
            <style>{customSwiperStyle}</style>
            {/* 🟣 HERO BANNER */}
            <section className="relative w-full h-[300px] md:h-[400px] bg-purple-200 overflow-hidden">
                <img
                    src="http://127.0.0.1:8000/images/shakeHand.jpg"
                    alt="ToGather Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-6">
                        Together{" "}
                        <span className="text-purple-600">we rise</span>,{" "}
                        <span className="text-white">ToGather</span>{" "}
                        <span className="text-purple-600">we grow</span>
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            asChild
                            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2"
                        >
                            <Link href="/campaigns/create">
                                Start a Business
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-white text-purple-700 hover:bg-purple-100 font-semibold px-6 py-2"
                        >
                            <Link href="/campaigns/list">Browse Campaigns</Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-white text-purple-700 hover:bg-purple-100 font-semibold px-6 py-2"
                        >
                            <Link href="/articles/list">Browse Articles</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-white text-purple-700 hover:bg-purple-100 font-semibold px-6 py-2"
                        >
                            <Link href="/donate">Donate Now</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 🟢 MAIN CONTENT */}
            <section className="py-7 px-6 md:px-12">
                <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                    Popular Business Campaign
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* 🟢 LEFT SIDE — Featured Campaign */}
                    {featuredCampaign && (
                        <div className="lg:w-1/3 w-full flex flex-col">
                            <div className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex flex-col h-full">
                                <img
                                    src={featuredCampaign?.images[0].url}
                                    alt={featuredCampaign.title}
                                    className="w-full h-64 object-cover"
                                />

                                <div className="p-5 flex flex-col justify-between flex-grow">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-xl dark:text-white">
                                                {featuredCampaign.title}
                                            </h3>

                                            {/* ❤️ Like Button */}
                                            <button
                                                onClick={() =>
                                                    handleLike(
                                                        featuredCampaign.id
                                                    )
                                                }
                                                className={`flex items-center gap-1 text-sm font-medium transition ${
                                                    likedCampaigns[
                                                        featuredCampaign.id
                                                    ] ??
                                                    featuredCampaign.is_liked
                                                        ? "text-red-500"
                                                        : "text-gray-500 hover:text-red-500"
                                                }`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill={
                                                        likedCampaigns[
                                                            featuredCampaign.id
                                                        ] ??
                                                        featuredCampaign.is_liked
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5A4.69 4.69 0 0012 6.12a4.69 4.69 0 00-4.312-2.37C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                    />
                                                </svg>
                                                <span>
                                                    {featuredCampaign.likes_count ??
                                                        featuredCampaign.likes
                                                            ?.length ??
                                                        0}
                                                </span>
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {featuredCampaign.category}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {featuredCampaign.address}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-25 line-clamp-3">
                                            {featuredCampaign.description}
                                        </p>

                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-purple-800 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(
                                                        (featuredCampaign.collected_amount /
                                                            featuredCampaign.goal_amount) *
                                                            100,
                                                        100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>

                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Rp
                                            {Number(
                                                featuredCampaign.collected_amount
                                            ).toLocaleString()}{" "}
                                            / Rp
                                            {Number(
                                                featuredCampaign.goal_amount
                                            ).toLocaleString()}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Duration</span>
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        className="bg-purple-800 text-white w-full mt-auto hover:bg-purple-700"
                                    >
                                        <Link
                                            href={`/campaigns/details/${featuredCampaign.id}`}
                                        >
                                            View Campaign
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🟣 RIGHT SIDE — Recommended Campaigns */}
                    <div className="lg:w-2/3 w-full flex flex-col justify-between">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-grow">
                            {paginatedCampaigns?.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/campaigns/details/${c.id}`}
                                    className="block"
                                >
                                    <Card className="overflow-hidden shadow-sm bg-white dark:bg-gray-800 transition-transform duration-200 hover:scale-[1.02] hover:shadow-md rounded-xl pt-0 cursor-pointer">
                                        <img
                                            src={c?.images[0].url}
                                            alt={c.title}
                                            className="w-full h-30 object-cover"
                                        />
                                        <CardContent className="p-2">
                                            <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-10 dark:text-white">
                                                {c.title}
                                            </h3>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 line-clamp-1">
                                                {c.category}
                                            </p>

                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-[6px] mb-1">
                                                <div
                                                    className="bg-purple-800 h-[6px] rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (c.collected_amount /
                                                                c.goal_amount) *
                                                                100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                                                Rp
                                                {Number(
                                                    c.collected_amount
                                                ).toLocaleString()}{" "}
                                                / Rp
                                                {Number(
                                                    c.goal_amount
                                                ).toLocaleString()}
                                            </p>

                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-[10px]">
                                                <Clock className="w-3 h-3" />
                                                <span>Duration</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* 🟤 Pagination */}
                        <div className="flex justify-center mt-8 gap-2">
                            {[1,2].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                                        page === p
                                            ? "bg-purple-800 text-white border-purple-800"
                                            : "bg-white dark:bg-gray-800 text-purple-800 dark:text-white border-purple-800 dark:border-gray-600 hover:bg-purple-100"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <hr className="border-t border-gray-300 dark:border-gray-700 w-11/12 mx-auto my-6" />
            {/* 🟣 Popular Business Categories Carousel */}
            <section className="bg-purple-100 dark:bg-purple-900/50 py-10 pb-0 px-6 md:px-12 mt-10 rounded-t-2xl">
                <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-6 text-center">
                    Popular Business Categories
                </h2>

                <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    speed={500}
                    className="w-full h-[400px]"
                >
                    {groupedCampaigns.map((category, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-purple-200 dark:bg-purple-800/30 p-6 rounded-xl shadow-sm h-full">
                                <h3 className="text-lg md:text-xl font-bold mb-4 text-center">
                                    {category.name}
                                </h3>

                                <div className="flex flex-row justify-center gap-6 items-center">
                                    {category.campaigns.length > 0 ? (
                                        category.campaigns.map((c, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/campaigns/details/${c.id}`}
                                                className="block"
                                            >
                                                <div className="w-[250px] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
                                                    <img
                                                        src={c?.images[0].url}
                                                        alt={c.title}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <div className="p-4">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                            {c.category}
                                                        </p>
                                                        <h4 className="font-semibold text-base mb-2 line-clamp-2 min-h-[48px] dark:text-white">
                                                            {c.title}
                                                        </h4>

                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                                            <div
                                                                className="bg-purple-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (c.collected_amount /
                                                                            c.goal_amount) *
                                                                            100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            ></div>
                                                        </div>

                                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-300">
                                                            Rp
                                                            {Number(
                                                                c.collected_amount
                                                            ).toLocaleString()}{" "}
                                                            /{" "}
                                                            <span className="text-purple-700 font-bold">
                                                                Rp
                                                                {Number(
                                                                    c.goal_amount
                                                                ).toLocaleString()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 dark:text-gray-400 italic">
                                            No campaigns available in this
                                            category
                                        </p>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            {/* 🟣 Divider sebelum section Articles */}
            <hr className="border-t border-gray-300 dark:border-gray-700 w-11/12 mx-auto my-10" />

            {/* 🟣 Creators' Corner / Popular Articles */}
            <section className="py-10 px-6 md:px-12">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-8">
                    Creators Article
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recommendedArticles?.slice(0, 4).map((article) => (
                        <div
                            key={article.id}
                            className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition"
                        >
                            {/* Thumbnail */}
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full md:w-1/3 h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                            />

                            {/* Text Section */}
                            <div className="p-4 flex flex-col justify-between md:w-2/3">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                                        {article.contents
                                            ?.find(
                                                (c) =>
                                                    (c.type === "text" ||
                                                        c.type ===
                                                            "paragraph") &&
                                                    c.order_x === 1 &&
                                                    c.order_y === 1
                                            )
                                            ?.content?.replace(
                                                /(<([^>]+)>)/gi,
                                                ""
                                            ) ||
                                            article.description ||
                                            "No description available."}
                                    </p>
                                </div>
                                <Link
                                    href={`/articles/${article.id}?from=home`}
                                    className="text-purple-800 font-semibold text-sm hover:underline hover:text-purple-600"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* 🟣 FAQ Section */}
            <section className="py-10 px-6 md:px-12 bg-purple-50 dark:bg-purple-900/40 mt-12 rounded-t-2xl">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center">
                    Frequently Asked Questions
                </h2>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full max-w-3xl mx-auto"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-gray-800 dark:text-gray-200 font-medium hover:text-purple-700">
                            What is ToGather?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                            ToGather is a crowdfunding platform that helps small
                            businesses and entrepreneurs gather financial
                            support from the community.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-gray-800 dark:text-gray-200 font-medium hover:text-purple-700">
                            How can I start a campaign?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                            Simply create an account, go to{" "}
                            <b>Start a Business</b>, fill out your campaign
                            details, and submit it for approval.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-gray-800 dark:text-gray-200 font-medium hover:text-purple-700">
                            How do donations work?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                            Supporters can donate directly to your campaign
                            through secure online payment. The funds go directly
                            to the campaign owner once the campaign is approved.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-gray-800 dark:text-gray-200 font-medium hover:text-purple-700">
                            Is there a fee for using ToGather?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                            Yes, ToGather charges a small service fee to
                            maintain platform operations and payment security.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </Layout>
    );
}
