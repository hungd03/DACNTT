import React, { useState } from "react";
import { FaInfoCircle, FaStar, FaVideo } from "react-icons/fa";
import ProductDescription from "./Dashboard/Product/ProductDescription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Comments } from "@/components/Comments";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ProductTabs = ({ data }) => {
  const { isLoggedIn, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Details");
  const handleTabClicked = (tab: string) => {
    setActiveTab(tab);
  };
  const transformYouTubeLink = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  return (
    <div className="border rounded-b-3xl rounded-t-3xl">
      <div className="flex tabs-container mb-4 p-4 overflow-x-auto flex-nowrap">
        {[
          {
            name: "Details",
            icon: <FaInfoCircle />,
          },
          {
            name: "Videos",
            icon: <FaVideo />,
          },
          {
            name: "Reviews",
            icon: <FaStar />,
          },
        ].map((tab) => (
          <div
            className={`${
              activeTab === tab.name
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            } tab px-4 py-2 border rounded-3xl mr-2 cursor-pointer whitespace-nowrap flex items-center space-x-2`}
            key={tab.name}
            onClick={() => handleTabClicked(tab.name)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </div>
        ))}
      </div>
      <div className="tab-content border p-6 rounded-b-3xl">
        {activeTab === "Details" && (
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Product Details
            </h2>
            <ProductDescription htmlContent={data?.description} />
          </div>
        )}
        {activeTab === "Videos" && (
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Product Videos
            </h2>
            {data?.videos?.length ? (
              <div className="grid md:grid-cols-2">
                {data?.videos?.map((item: any, index) => {
                  const videoEmbedUrl = transformYouTubeLink(item?.videoLink);
                  return (
                    <div key={index}>
                      <iframe
                        src={videoEmbedUrl}
                        frameBorder="0"
                        allowFullScreen
                        width="100%"
                        height="500px"
                        title={`Product Video ${index + 1}`}
                      ></iframe>
                    </div>
                  );
                })}
              </div>
            ) : (
              <img src="/no-videos-found.jpg" className="block mx-auto" />
            )}
          </div>
        )}

        {activeTab === "Reviews" && (
          <div>
            {isLoggedIn && user ? (
              <Comments productId={data._id} userId={user._id} />
            ) : (
              <Alert>
                <AlertDescription>
                  Please sign in to view and post reviews.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
