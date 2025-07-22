'use client';

import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { set } from "better-auth";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, use, useEffect, useState } from "react";

const uploadFileToBunny = (file: File,uploadUrl: string,accessKey: string): Promise<void> => {
  return fetch(uploadUrl,{
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      AccessKey: accessKey,
    },
    body:file,
  }).then((reponse)=>{
    if (!reponse.ok) throw new Error('Upload failed')
  })
}

const Page = () => {
  const router = useRouter();
  const [isSubmitting,setIsSubmitting] =useState(false);
  const [videoDuration,setVideoDuration] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private',
  });
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
  useEffect(()=>{
    if(video.duration != 0 || null){
      setVideoDuration(video.duration)
    }
  }),[video.duration]

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;

        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);

          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }

        if (duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error loading recorded video:", err);
      }
    };

    checkForRecordedVideo();
  }, [video]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try{
      if(!video.file || !thumbnail.file){
        setError('Please upload video and thumbnail');
        setIsSubmitting(false);
        return;
      }
      if(!formData.title || !formData.description){
        setError('Please fill in all the details');
        setIsSubmitting(false);
        return;
      }

      // 0 get ulpoad url
      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey
      } = await getVideoUploadUrl();

      if (!videoUploadUrl || !videoAccessKey) throw new Error('Failed to get video upload credentials')
      
      // 1 Upload the video to Bunny
      await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);
      console.log(`Video ID: [${videoId}]`);

      // 2 Upload thumbnail url to DB
      const {
        uploadUrl: thumbnailUploadUrl,
        accessKey: thuumnnailAccessKey,
        cdnUrl: thumbnailCdnUrl,
      } = await getThumbnailUploadUrl(videoId); 

      if (!thumbnailUploadUrl || !thuumnnailAccessKey || !thumbnailCdnUrl) throw new Error('Failed to get thumbnail upload credentials')
      
      await uploadFileToBunny(thumbnail.file,thumbnailUploadUrl,thuumnnailAccessKey);

      //Create a new DB entry for the video Details (urls, data)
      await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration,
        visibility: formData.visibility as "private" | "public",
      })
      console.log("Redirecting to: ", `/video/${videoId}`);
      router.push(`/`)
    } catch(error){
      console.log("Error submitting form: ",error)
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <div className="wrapper-md upload-page">
        <h1>Upload Page</h1>

        {error && <div className="error">{error}</div>}

        <form className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
           onSubmit={handleSubmit}>
            <FormField 
                id='title'
                label='Title'
                placeholder='Enter a clear and concise title'
                value={formData.title}
                onChange={handleInputChange}
            />

             <FormField 
                id='description'
                label='Description'
                placeholder='Describe your video'
                value={formData.description}
                as='textarea'
                onChange={handleInputChange}
            />

            <FileInput 
          id='video'
          label='Video'
          accept='video/*'
          file={video.file}
          previewURL={video.previewURL}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type='video' previewUrl={null}            />

            <FileInput 
          id='thumbnail'
          label='Thumbnail'
          accept='image/*'
          file={thumbnail.file}
          previewURL={thumbnail.previewURL}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type='image' previewUrl={null}            />

            <FormField 
                id='visibility'
                label='Visibility'
                as='select'
                options={[
                  { label: "Public", value: "public" },
                  { label: "Private", value: "private" } 
                ]}
                value={formData.visibility}
                onChange={handleInputChange}
            />

            <button type='submit' disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Uploading...' : 'Upload video'}
            </button>
        </form>
    </div>
  );
}

export default Page;