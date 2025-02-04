import React from 'react'
import './AIFeature.css'
import FeatureCards from '../Cards/FeatureCard/FeatureCards'
import { HOME_PAGE, IMAGES } from '../../../../Shared'

const AIFeature = () => {
  return (
    <>
    <div className="feature" style={{height:"1000px"}}>
     <div id="feature-header">
        <h2 style={{ fontSize: "32px", color: "white"}}>
       {HOME_PAGE.AI_FEATURE.INTRO}
        </h2>
        <p style={{ fontSize: "18px", color: "#a3a3a3" }}>
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