'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const handleSignIn = async () =>{
    console.log("BASE URL:", process.env.NEXT_PUBLIC_BASE_URL)
    return await authClient.signIn.social({provider: 'google'})
  }
  
  return (
    <main className='sign-in'>
      <aside className='testimonial'>
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="Logo" width={32} height={32} />
          <h1>SnapCast</h1>
        </Link>

        <div className='description'>
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Image src="/assets/icons/star.svg"
                  alt="star" width={20} height={20} key={index} />
              ))}
            </figure>
            <p>SnapCast makes screen recording easy. From quick walkthroughs to full
              tutorials, you can record your screen and share it with the world.</p>
            <article>
                <Image src="/assets/images/jason.png" alt="Jason"
                 width={64} height={64} className="rounded-full" />
                 <div>
                  <h2>Jason Doe</h2>
                  <p>Web Developer, SnapCast</p>
                 </div>
            </article>
          </section>
        </div>
        <p> SnapCast {(new Date()).getFullYear()}</p>
      </aside>
      <aside className='google-sign-in'>
        <section>
            <Link href="/">
            <Image src="/assets/icons/logo.svg" alt="Logo" width={32} height={32} />
            <h1>SnapCast</h1>
            </Link>
            <p>
              Create and share your very first <span>SpanCast Video </span> 
              in no time!
            </p>
            <button onClick={() => router.push('/userinputs')}>
              <span>Create your Account </span>
            </button>
            <button onClick={handleSignIn}>
              <Image src="/assets/icons/google.svg" alt="Google" width={24} height={24} />
              <span>Sign in with Google</span>
            </button>
        </section>
      </aside>
      <div className='overlay'/>
    </main>
  )
}

export default Page
