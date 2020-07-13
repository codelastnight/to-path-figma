import * as React from 'react'

interface TutorialProps {
    showTutorial: React.Dispatch<React.SetStateAction<boolean>>
}
function Tutorial(props: TutorialProps) {

	return (
		<div className="flex-about">
            
            <button
                    className="button button--secondary "
                    onClick={() => props.showTutorial(false)}>
                    Close Tutorial
                </button>
		</div>
	)
}

export default Tutorial