import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DropdownList from './DropdownList'
import RecordScreen from './RecordScreen'
const Header = ({ subHeader, title, userImg} : SharedHeaderProps) => {
  return (
    <header className="header">
      <section className='header-container'>
        <div className='details'>
            {userImg && (
               <Image src={userImg || "/assets/images/dummy.jpg"} alt="User" width={66} height={66}
                className="rounded-full"/>
            )}
            <article>
                <p>{subHeader}</p>
                <h1>{title}</h1>
            </article>
        </div>

        <aside>
            <Link href="/upload">
                <Image src="/assets/icons/upload.svg" alt="Upload" width={16} height={16} />
                <span>Upload a video</span>
            </Link>
            <RecordScreen />
            <Link href={`/delete`}>
                <Image src="/assets/icons/delete.png" alt="Delete" width={16} height={16} />
                <span>Delete a video</span>
            </Link>
        </aside>
      </section>

      <section className='search-filter'>
        <div className='search'>
            <input type="text" placeholder='Search for videos, tags, folders..' />
            <Image src="/assets/icons/search.svg" alt="Search" width={16} height={16} />
        </div>

        <DropdownList/>
      </section>
    </header>
  )
}

export default Header