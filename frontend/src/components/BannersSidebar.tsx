import React, { useState } from "react";
import "../../public/styles/BannersSidebar.css";
import { Bell, X } from "lucide-react";
import { Banner } from "@/types/types";
import { ExpandableBanner } from "../components/Banner.tsx";

export const BannersSidebar: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "banner1",
      type: "promo",
      title: "Spring Sale",
      message: "Enjoy 20% off on all premium features until April 30th!",
    },
    {
      id: "banner2",
      type: "update",
      title: "New Version Available",
      message: "Update to version 2.4.1 for enhanced security features.",
    },
    {
      id: "banner3",
      type: "warning",
      title: "Scheduled Maintenance",
      message: "Our services will be unavailable on April 15th from 2AM-4AM EST.",
    },
    {
      id: "banner4",
      type: "info",
      title: "Product Tour",
      message: "Discover new features with our interactive product tour.",
      actionText: "Start Tour"
    }
  ]);

  const handleCloseBanner = (bannerId: string) => {
    setBanners(banners.filter(banner => banner.id !== bannerId));
  };

  // Map banner types to appropriate colors for ExpandableBanner
  const getBannerColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-900/20";
      case "warning":
        return "bg-yellow-900/20";
      case "promo":
        return "bg-purple-900/20";
      case "update":
        return "bg-green-900/20";
      default:
        return "bg-neutral-800";
    }
  };


  return (
    <div id="bannersSB" className="bannersSB flex flex-col bg-neutral-900 p-4 space-y-4 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="top_picks text-xl font-bold text-white flex items-center py-3">
          <Bell size={20} className="mr-2" />
          Top Picks
        </h2>
        {banners.length > 0 && (
          <button 

            className="cursor-pointer text-sm font-bold text-neutral-400 hover:text-white transition-colors"
            onClick={() => setBanners([])}
          >
            Clear all
          </button>
        )}
      </div>
      
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
          <Bell size={32} className="mb-2 opacity-50" />
          <p>No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="relative">
              {banner.isNew && (
                <span className="absolute -top-1 -right-1 z-10 bg-red-500 rounded-full w-3 h-3"></span>
              )}
              <div className="relative">
                <ExpandableBanner
                  title={banner.title}
                  description={banner.message}
                  color="#542ABA"
                  icon="star"
                />
                <button 
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                  onClick={() => handleCloseBanner(banner.id)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersSidebar;