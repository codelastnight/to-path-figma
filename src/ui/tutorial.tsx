import * as React from 'react'
import { useState, useEffect } from 'react'

interface tutorialData {
    img: string
    text: string
}
const tutorialList: tutorialData[] = [
       { 
           "img": "https://i.imgur.com/tNWtoMp.gif",
           "text": "First, select a curve and then another object at the same time. Then, simply click the 'Link' button."
        },
        { 
            "img": "https://i.imgur.com/wNxR7WC.gif",
            "text": "Use the same process for text, select both acurve and a line of text. Then, simply click the 'Link' button."
         },
         { 
            "img": "https://i.imgur.com/lfXSeMQ.gif",
            "text": "After an object has been 'Linked', you can change the settings and see your changes live"
         }
    ]

interface TutorialProps {
    showTutorial: React.Dispatch<React.SetStateAction<boolean>>
}
function Tutorial(props: TutorialProps) {
	const [step, changeStep] = useState(0)

	return (
		<div className="flex-about tutorial">
            <div className="header">
						<p className="type type--neg-medium-bold">
                        ⋆✧—— ✧ *⋆ 𝙏𝙪𝙩𝙤𝙧𝙞𝙖𝙡 ⋆* ✧——⋆✧


                        </p>
                       
            </div>
            <div className="flex-about content">
                <img src={tutorialList[step].img} alt="can't connect to imgur" />

                <p className="type type--neg-small-normal"> 
                    {tutorialList[step].text}
                </p>
            </div>
            <button
                    className="button button--secondary "
                    onClick={() => {(step+1) < tutorialList.length ? changeStep(step +1) : changeStep(0) }
                    }>

                   {(step+1) < tutorialList.length ? 'Next →' : '← Restart' } 
            </button>
            <button
                    className="button button--secondary link"
                    onClick={() => props.showTutorial(false)}>
                    Close Tutorial
            </button>
		</div>
	)
}

export default Tutorial