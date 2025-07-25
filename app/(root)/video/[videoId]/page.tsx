import VideoDetailHeader from "@/components/VideoDetailHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideoById } from "@/lib/actions/video";
import { url } from "inspector";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({params}: {params : {videoId:string}}) => {
    const {videoId} = await params;

    const data = await getVideoById(videoId);

    if (!data?.video) redirect('/delete');
    const {video, user} = data;
    return (
        <main className="wrapper page">
            <VideoDetailHeader {...video} userImg={user?.image} username={user?.name}
             ownerId={video.userId}/>
            <section className="video-details">
                <div className="content">
                    <VideoPlayer videoId={video.videoId}/>
                </div>
            </section>
        </main>
    )
}
export default Page;