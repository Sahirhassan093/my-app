'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const DeleteHeader = () => {
  const router = useRouter();

  return (
    <header className="delete-header py-6 px-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">

        <div>
          <h1 className="text-2xl">Delete Videos</h1>
        </div>
      </div>
      <button
        onClick={() => router.push('/')}
        className="text-white px-4 py-2 bg-pink-100 rounded hover:bg-pnk-100 transition"
      >
        ← Back to Dashboard
      </button>
    </header>
  );
};

export default DeleteHeader;
