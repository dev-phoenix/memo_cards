import Image from 'next/image';
import React from 'react';

function CardItem({v, cardClick}) {
    return (
        <div key={v.key} className="card" onClick={(e)=>(cardClick(e))}>
            <div className="back flex items-center justify-center">
            <div className="card_logo_text flex items-center justify-center card-val" 
            data-val={v.val}>{v.ico}</div>
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
    )
}

export default CardItem