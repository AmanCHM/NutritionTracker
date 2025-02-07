import React from 'react'
import './AIFeature.css'
import FeatureCards from '../Cards/FeatureCard/FeatureCards'
import { HOME_PAGE, IMAGES } from '../../../../Shared'
import colors from '../../../../assets/Css/color'

const AIFeature = () => {
  return (
    <>
    <div className="feature" style={{height:"1000px"}}>
     <div id="feature-header">
       <h2 style={{ fontSize:"2.5rem", color: colors.whiteColor}}> 
       {HOME_PAGE.AI_FEATURE.INTRO}
        </h2>
        <p style={{ fontSize:"1.5rem"}}>
          {" "}
          {HOME_PAGE.AI_FEATURE.GREET}
        </p>
      </div>
      <div className="feature-component">
        <img 
          id="feature-image"
          
          src={IMAGES.aiImage}
          alt="feature"
        />
        <div id="feature-card">

      
          <FeatureCards
            header= {HOME_PAGE.AI_FEATURE.CARD_HEADER}
            description={HOME_PAGE.AI_FEATURE.CARD_DESCRIPTION}
          />
          
        </div>
      </div>

      </div>
    
    </>
  )
}

export default AIFeature