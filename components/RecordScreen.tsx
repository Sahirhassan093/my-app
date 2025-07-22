'use client';

import React, { use, useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants";
import { useRouter } from "next/navigation";
import { useScreenRecording } from "@/lib/hooks/useScreenRecording";

const RecordScreen = () => {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const { isRecording,recordedBlob,recordedVideoUrl,recordingDuration,startRecording,stopRecording,resetRecording } = useScreenRecording();
   const closeModel = () => {
      resetRecording();  
      setIsOpen(false);
   }

   const handleStart = async () => {
      await startRecording();
   }

   const recordAgain = async () =>{
        resetRecording();
        await startRecording();

        if (recordedVideoUrl && videoRef.current) {
            videoRef.current.src = recordedVideoUrl;
        }
   }

   const goToUpload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem('recordedVideo',
        JSON.stringify({url,
        name: 'screen-recording.webm',
        type: recordedBlob.type,
        size: recordedBlob.size,
        duration: recordingDuration || 0,})
    );
    router.push('/upload');
    closeModel();
   }
    return (
            <div className="record">
                <button className='primary-btn' onClick={() => setIsOpen(true)}>
                    <Image src={ICONS.record} alt="Record" width={16} height={16} />
                    <span>Record a video</span>
                </button>

                {isOpen && (
                    <section className="dialog">
                        <div className="overlay-record" onClick={closeModel} />
                            <div className="dialog-content">
                                <figure>
                                    <h3>Screen Recording</h3>
                                    <button>
                                        <Image src={ICONS.close} alt="Close" width={20} height={20} onClick={closeModel} /> 
                                    </button>
                                </figure>
                                <section>
                                    {isRecording ? (
                                        <article>
                                            <div />
                                            <span>Recording...</span>
                                        </article>
                                    ): recordedVideoUrl ?(
                                        <video ref={videoRef}
                                         src={recordedVideoUrl} controls /> 
                                    ): (
                                        <p>Click record to start recording</p>
                                    )}
                                </section>
                                <div className="record-box">
                                    {!isRecording && !recordedVideoUrl && (
                                        <button onClick={handleStart}
                                        className="record-start">
                                            <Image src={ICONS.record}
                                            alt="record" width={16} height={16}/>
                                            Record
                                        </button>
                                    )}
                                    {isRecording && (
                                        <button onClick={stopRecording}
                                        className="record-stop">
                                            <Image src={ICONS.record}
                                            alt="stop" width={16} height={16}/>
                                            Stop
                                        </button>
                                    )}
                                    {recordedVideoUrl && (
                                        <>
                                            <button onClick={recordAgain}
                                            className="record-again">
                                                <Image src={ICONS.record}
                                                alt="record again" width={16} height={16}/>
                                                Record Again
                                            </button>
                                            <button onClick={goToUpload} className="primary-btn">
                                                <Image src={ICONS.upload}
                                                alt="Upload" width={16} height={16}/>
                                                Upload Video
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                    </section>
                )}
            </div>
  );
}

export default RecordScreen;