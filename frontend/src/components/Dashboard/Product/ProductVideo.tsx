import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, AlertCircle, Youtube } from "lucide-react";
import { useProductVideos } from "@/features/products/hooks/useProduct";

interface Video {
  _id?: string;
  videoProvider: string;
  videoLink: string;
}

interface ProductVideosProps {
  productId: string;
}

const ProductVideos: React.FC<ProductVideosProps> = ({ productId }) => {
  const { videos, isLoading, addVideo, deleteVideo } =
    useProductVideos(productId);
  const [newVideo, setNewVideo] = useState<Omit<Video, "_id">>({
    videoProvider: "",
    videoLink: "",
  });
  const [error, setError] = useState("");

  const videoProviders = [
    { value: "youtube", label: "YouTube" },
    { value: "vimeo", label: "Vimeo" },
  ];

  const extractVideoId = (url: string, provider: string): string | null => {
    if (provider === "youtube") {
      const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      return match ? match[1] : null;
    } else if (provider === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const getEmbedUrl = (url: string, provider: string): string => {
    const videoId = extractVideoId(url, provider);
    if (!videoId) return "";

    return provider === "youtube"
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://player.vimeo.com/video/${videoId}`;
  };

  const handleAddVideo = async () => {
    if (!newVideo.videoProvider || !newVideo.videoLink) {
      setError("Please fill in all fields");
      return;
    }

    if (!extractVideoId(newVideo.videoLink, newVideo.videoProvider)) {
      setError("Invalid video URL");
      return;
    }

    try {
      await addVideo(newVideo);
      setNewVideo({ videoProvider: "", videoLink: "" });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add video");
    }
  };

  const handleRemoveVideo = async (videoId: string) => {
    try {
      await deleteVideo(videoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Product Videos
          </h2>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video Provider</Label>
                <Select
                  value={newVideo.videoProvider}
                  onValueChange={(value) =>
                    setNewVideo({ ...newVideo, videoProvider: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoProviders.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Video Link</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newVideo.videoLink}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, videoLink: e.target.value })
                    }
                    placeholder="Paste video URL here"
                    disabled={isLoading}
                  />
                  <Button onClick={handleAddVideo} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {videos.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={getEmbedUrl(video.videoLink, video.videoProvider)}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Youtube className="h-4 w-4" />
                      <span>{video.videoLink}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveVideo(video._id!)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductVideos;
