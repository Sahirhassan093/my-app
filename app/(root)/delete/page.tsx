import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAllVideosByUser } from "@/lib/actions/video";
import DeleteHeader from "@/components/DeleteHeader";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import React from "react";
import DeleteVideoCard from "@/components/DeleteVideoCard";


const Page = async () => {
  const session = await auth.api.getSession({ headers: headers() });
  const userId = session?.user.id;

  if (!userId) {
    return ('/404')
  }

  const { videos } = await getAllVideosByUser(userId);

  return (
    <div className="wrapper page">
      <DeleteHeader />
      {Array.isArray(videos) && videos.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video, user }) => (
            <DeleteVideoCard
              key={video.id}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image || ""}
              username={user?.name || "Guest"}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Available Yet"
          description="Videos will show up once you upload them"
        />
      )}
    </div>
  );
};

export default Page;
