import React from "react";
import Image from "next/image";

const FormField = ({id, label, accept, previewURL, inputRef,
    onChange,onReset, type, file}: FileInputProps & { previewURL?: string }) => {
  return (
    <section className="file-input">
        <label htmlFor={id}>{label}</label>

        <input 
            id={id}
            type="file"
            accept={accept}
            ref={inputRef}
            hidden
            onChange={onChange}
        />

        {!previewURL ? (
            <figure onClick={() => inputRef.current?.click()}>
                <img src="/assets/icons/upload.svg" alt="upload" width={24} height={24}/>
                <span>Click to upload your {id}</span>
            </figure>
        ) : (
            <div>
                {type === 'video' 
                    ? <video src={previewURL} controls />
                    : <Image src={previewURL} alt="image" fill />
                }
                <button type="button" onClick={onReset}>
                    <Image src="/assets/icons/close.svg" alt="close" width={16} height={16} />
                </button>
                <p>{file?.name}</p>
            </div>
        )}
    
    </section>
  );
}   

export default FormField;