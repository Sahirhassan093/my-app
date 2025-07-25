'use client';
import Link from "next/link";
import React, { startTransition, useTransition } from "react";
import Image from "next/image";
import { start } from "repl";
import { deleteVideoById } from "@/lib/actions/video";
import { useRouter } from "next/navigation";

const DeleteVideoCard = (
    {
        id,
        title,
        thumbnail,
        createdAt,
        userImg,
        username,
        views,
        visibility,
        duration
    }: VideoCardProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const handleDelete = () => {
        startTransition(async ()=> {
            await deleteVideoById(id);
            router.refresh()
        })
    }
    return(
        <Link href={`/video/${id}`} className="video-card">
            <Image src={thumbnail} alt="thumbnail" width={290} height={160} className="thumbnail" />
            <article>
                <div>
                    <figure>
                        <Image src={userImg || "/assets/images/dummy.jpg"} alt="avatar" width={34} height={34} className="rounded-full aspect-square"/>
                        <figcaption>
                            <h3>{username}</h3>
                            <p>{visibility}</p>
                        </figcaption>
                    </figure>
                    <aside>
                        <Image src="/assets/icons/eye.svg" alt="views" width={16} height={16} />
                        <span>{views}</span>
                    </aside>
                </div>
                <h2>{title} - {" "} {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })}</h2>
             <div className="flex items-center gap-3 mt-2">
             <button className="hover:text-red-500">
                <Image src="/assets/icons/link.svg" alt="copy" width={18}
                height={18} />
            </button>
            <button onClick={handleDelete} className="hover:image-white-500"
                disabled={isPending}>
                    {isPending ? (
                        <Image src="/assets/icons/spinner.svg" alt="loading" width={18} height={18} className="animate-spin" />
                    ) : null}
                <Image src="/assets/icons/delete.png" alt="delete" width={18} height={18} />
            </button>
             </div>
            </article>
            {duration && (
                <div className="duration">
                    {Math.ceil(duration / 60)}min
                </div>
             )}
        </Link>
    )
}

export default DeleteVideoCard;