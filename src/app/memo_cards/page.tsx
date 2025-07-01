"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
//import '@/lib/firework.js';
import WinCanvas from "@/lib/firework.js";
import Monitor from "@/lib/Monitor";
import CardItem from "./components/Card";
import { memoryUsage } from 'node:process';


export default function Home() {

    // const [cardCounter, setCardCounter] = useState([])
    // setCardCounter([])
    const [displayLose, setDisplayLose] = useState(true)
    const [displayWin, setDisplayWin] = useState(true)
    const [timer, setTimer] = useState(300)
    const [gameState, setGameState] = useState(0) // 0: stop, 1: play, 2: win, 3: lose

    let _cards: any[] = [];
    const [cards, setCards] = useState(_cards)
    const [cardsGet, setCardsGet] = useState(0)

    let cardsCount = 24;
    let cardsGroupCount = 3;
    let cardsGroupsCount = cardsCount / cardsGroupCount;
    let timerHendler: NodeJS.Timeout | undefined = undefined
    let timerLimit = 30//0

    const [monitorData, setMonitorData] = useState({})


    function randomCards() {
        let cards: any[] = [];
        for (let i = 1; i <= cardsCount; i++) {
            let val = (i % cardsGroupsCount) + 1;
            let ico = val;
            let rand = Math.floor(Math.random() * (100));
            cards.push({ key: i, val: val, ico: ico, rand: rand })
        }
        cards.sort((a, b) => (a.rand - b.rand))
        setCards([...cards])
        console.log(cards)
    }

    let timers: any = []
    let timersCount = 0

    const gameStart = () => {
        setCardsGet(cardsGroupsCount)
        setTimer(timerLimit)
        clearInterval(timerHendler)
        timersCount++
        timerHendler = setInterval(timerTick.bind(null, timersCount), 1000)
        randomCards()
        setGameState(1)
    }

    const gameStop = () => {
        clearInterval(timerHendler)
    }
    const formatMemoryUsage = (data: any) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    // const { memoryUsage } = require('node:process');
    // console.log('memoryUsage', memoryUsage);


    // let monitor = new Monitor()


    const timerTick = (tc: number) => {
        setTimer((timer) => {
            if (timer <= 0) {
                gameStop()
                lose()
            }
            console.log(timer % 2 ? 'tic' : 'tac', tc, timer)
            return timer - 1
        })
        // let memo = window.performance.memory

        // const memoryData = process.memoryUsage();
        // let memoryData = process.memoryUsage();
        // let memoryData = memoryUsage();

        // let _memoryUsage = {
        //   jsHeapSizeLimit: `${formatMemoryUsage(memo.jsHeapSizeLimit)} -> jsHeapSizeLimit`,
        //   totalJSHeapSize: `${formatMemoryUsage(memo.totalJSHeapSize)} -> totalJSHeapSize`,
        //   usedJSHeapSize: `${formatMemoryUsage(memo.usedJSHeapSize)} -> usedJSHeapSize`,
        // };
        // let _memoryUsage2 = {
        //   jsHeapSizeLimit: `${formatMemoryUsage(memo.jsHeapSizeLimit)}`,
        //   totalJSHeapSize: `${formatMemoryUsage(memo.totalJSHeapSize)}`,
        //   usedJSHeapSize: `${formatMemoryUsage(memo.usedJSHeapSize)}`,
        // };

        // let _memoryUsage = {
        //   rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
        //   heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
        //   heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
        //   external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
        //   arrayBuffers: `${formatMemoryUsage(memoryData.arrayBuffers)} -> arrayBuffers`,
        // };
        // console.log(_memoryUsage);
        // setMonitorData(_memoryUsage2)
    }

    useEffect(() => {
        setCardsGet(cardsGroupsCount)
        randomCards()
    }, [])

    const suffleCards = () => {
        randomCards()
    }

    let cards_counter: any[] = []

    const cardsDeselect = () => {
        console.log('cardsDeselect')
        let equals = true;
        console.log(cards_counter[0].querySelector('.card-val'))
        let def = cards_counter[0].querySelector('.card-val').dataset.val;
        cards_counter.forEach((el, i, arr) => {
            let val = el.querySelector('.card-val').dataset.val;
            if (val != def) equals = false
        })
        cards_counter.reduce((val, el) => {
            console.log(el, val)
            el.classList.remove('rotate')
            el.classList.add('norotate')
            return val
        }, 0)
        if (equals) {
            cards_counter.forEach(el => el.classList.add('hide'))
            setCardsGet((cou) => (cou - 1))
            if (cardsGet <= 0) {
                win()
            }
        }
        cards_counter = []
    }

    const cardClick = (e: any) => {
        setMonitorData((state) => ({ ...state, 'cardClick': e.target.closest('.card').querySelector('.card-val').dataset.val }))
        console.log('cardClick', e.target.closest('.card').querySelector('.card-val').dataset.val)
        setMonitorData((state) => ({ ...state, 'cards_counter 1': cards_counter.length }))
        console.log('cards_counter', cards_counter)
        if (gameState == 0) {
            gameStart()
        }
        setMonitorData((state) => ({ ...state, 'gameState': gameState }))
        if (cards_counter.length >= 3) return
        let el = e.target.closest('.card')
        setMonitorData((state) => ({ ...state, 'classList className': el.className }))
        setMonitorData((state) => ({ ...state, 'classList hide': el.classList.contains('hide') }))
        setMonitorData((state) => ({ ...state, 'classList rotate': el.classList.contains('rotate') }))
        if (el.classList.contains('hide')) return
        // setCardCounter([...cards_counter, el])
        // console.log(cardCounter)
        if (!el.classList.contains('rotate')) {
            cards_counter.push(el)
            el.classList.remove('norotate')
            el.classList.add('rotate')
        }
        else {
            // el.classList.remove('rotate')
            // el.classList.add('norotate')
        }

        if (cards_counter.length >= 3) {
            setTimeout(cardsDeselect, 1000)
        }
        setMonitorData((state) => ({ ...state, 'cards_counter 2': cards_counter.length }))
    }

    const reset = () => {
        gameStop()
        setCardsGet(cardsGroupsCount)
        setTimer(timerLimit)
        setGameState(0)
        setDisplayWin(false)
        // randomCards()
        cards_counter = []
        let els = document.querySelectorAll('.card').forEach((el) => {
            el.classList.remove('norotate')
            el.classList.remove('rotate')
            el.classList.remove('hide')
        })
    }

    const win = () => {
        setGameState(2)
        setDisplayWin((stat) => { return !stat })
    }

    const lose = () => {
        setGameState(3)
        setDisplayWin((stat) => { return !stat })
    }

    const closeWin = () => {
        setDisplayWin((stat) => { return !stat })
    }

    // width={170}
    // height={38}

    let href_url_1 = "https://nextjs.org/learn?"
    +"utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    let href_url_2 = "https://vercel.com/templates?"
    +"framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw"
    +"&utm_campaign=create-next-app"
    let href_url_3 = "https://nextjs.org?"
    +"utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"

    return (
        <>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center
                min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <header className="header flex items-center justify-between w-screen max-w-[1400px]">
                    <div className="info">To close: {cardsGroupsCount - cardsGet} = {cardsGroupsCount} - {cardsGet};</div>
                    <div className="timer">{timer}</div>
                </header>
                <main id="memo_cards_main" className="
                    flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                    <div className="memo_cards_field
                            grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-10 
                            items-center justify-items-center -min-h-screen
                            font-[family-name:var(--font-geist-sans)]">
                        {cards.map((v) => (
                            <CardItem key={v.key} v={v} cardClick={cardClick} />
                        ))}
                        <WinCanvas
                            display={displayWin}
                            closeWin={closeWin}
                            gameState={gameState}
                            setMonitorData={setMonitorData}
                            />
                    </div>


                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <a
                            className="rounded-full border border-solid border-black/[.08]
                            dark:border-white/[.145] transition-colors
                            flex items-center justify-center 
                            hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent 
                            font-medium text-sm sm:text-base 
                            h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                            href="/"
                        >
                            Home
                        </a>
                        <a
                            className="rounded-full border border-solid border-black/[.08]
                            dark:border-white/[.145] transition-colors
                            flex items-center justify-center
                            hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent
                            font-medium text-sm sm:text-base
                            h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                            onClick={reset}
                        >
                            Reset
                        </a>
                        <a
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                            onClick={win}
                        >
                            Win
                        </a>
                    </div>
                </main>
                <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href={href_url_1}
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
                        href={href_url_2}
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
                        href={href_url_3}
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
            <Monitor
                monitorData={monitorData}
                setMonitorData={setMonitorData}
            />
            {/* title={monitor_title} fields={monitorFields} data={monitorData} */}
        </>
    );
}
