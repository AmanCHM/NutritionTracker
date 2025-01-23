import React from 'react'

interface FeatureCardsProps {
  header: string;
  description: string;
}


const FeatureCards: React.FC<FeatureCardsProps> = (props) => {

    const {header,description} = props
  return (
    <>
          <div>
            <img src="" alt="" />
        <h3 style={{color:"white", textAlign:"center"}}>  {header}</h3>
        <p> {description}</p>
        </div>
    </>
  )
}

export default FeatureCards;