'use client';
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  // const [cardCounter, setCardCounter] = useState([])
  // setCardCounter([])

  let cards: any[] = [];

  for(let i = 1; i<=24; i++){
    cards.push( ( i % 8 ) + 1 )
  }

  let cards_counter: any[] = []

  const cardsDeselect = () => {
    let equals = true;
    console.log(cards_counter[0].querySelector('.card-val'))
    let def = cards_counter[0].querySelector('.card-val').dataset.val;
    cards_counter.forEach((el, i, arr)=>{
      let val = el.querySelector('.card-val').dataset.val;
      if(val != def) equals = false
    })
    cards_counter.reduce((val, el)=>{
      console.log(el,val)
      el.classList.remove('rotate')
      el.classList.add('norotate')
      return val
    }, 0)
    if(equals){
      cards_counter.forEach(el=>el.classList.add('hide'))
    }
    cards_counter = []
  }

  const cardClick = (e: any) => {
    if(cards_counter.length >= 3) return
    let el = e.target.closest('.card')
    if(el.classList.contains('hide'))return
    // setCardCounter([...cards_counter, el])
    // console.log(cardCounter)
    if(!el.classList.contains('rotate')){
      cards_counter.push(el)
      el.classList.remove('norotate')
      el.classList.add('rotate')
    }
    else{
      // el.classList.remove('rotate')
      // el.classList.add('norotate')
    }

    if(cards_counter.length >= 3){
      setTimeout( cardsDeselect, 1000 )
    }
  }

  const reset = () => {
    cards_counter = []
    let els = document.querySelectorAll('.card').forEach((el) => {
      el.classList.remove('norotate')
      el.classList.remove('rotate')
      el.classList.remove('hide')
    })
  }
                    // width={170}
                    // height={38}


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>

      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-10 
        items-center justify-items-center -min-h-screen font-[family-name:var(--font-geist-sans)]">
          {cards.map((v)=>(
            <div key={v} className="card" onClick={(e)=>(cardClick(e))}>
              <div className="back flex items-center justify-center">
                <div className="card_logo_text flex items-center justify-center card-val" data-val={v}>{v}</div>
              </div>

              <div className="front flex items-center justify-center">
                <Image
                  className="dark:invert card_logo"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={0}
                  height={0}
                  priority
                /></div>
            </div>
          ))}
        </div>


        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/"
          >
            Home
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            onClick={reset}
          >
            Reset
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
