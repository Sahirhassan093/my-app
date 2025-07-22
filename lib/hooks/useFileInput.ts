import { duration } from "drizzle-orm/gel-core";
import { ChangeEvent, useEffect, useRef, useState } from "react"

export const useFileInput = (maxSize: number) => {
    const[file,setFile] =useState<File | null>(null);
    const[previewURL,setPreviewURL] = useState('');
    const [duration, setDuration] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files?.[0]){
            const selectedFile = e.target.files[0];
            if (selectedFile.size > maxSize) {
                return;
            }
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
            setFile(selectedFile);

            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewURL(objectUrl);

            if (selectedFile.type.startsWith('video')) {
                const video = document.createElement('video');

                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    if( isFinite(video.duration) && video.duration > 0){
                        setDuration(Math.round(video.duration));
                    } else {
                        setDuration(0);
                    }
                    //URL.revokeObjectURL(objectUrl);
                }
                video.src = objectUrl;
            }
        }
    } 
    useEffect(() => {
        return () =>{
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);

    const resetFile = () => {
        setFile(null);
        setPreviewURL('');
        setDuration(0);
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement).value = '';
        }
    }

    return {
        file,
        previewURL,
        duration,
        inputRef,
        handleFileChange,
        resetFile
    };
}