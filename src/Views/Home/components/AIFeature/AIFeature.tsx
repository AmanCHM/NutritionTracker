import React from 'react'
import './AIFeature.css'
import FeatureCards from '../Cards/FeatureCard/FeatureCards'
import { IMAGES } from '../../../../Shared'
// import FeatureCards from './FeatureCards'
// import Image from '../Image/Image'
const AIFeature = () => {
  return (
    <>
    <div className="feature" style={{height:"1000px"}}>
     <div id="feature-header">
        <h2 style={{ fontSize: "32px", color: "white"}}>
        Introducing  AI Feature
        </h2>
        <p style={{ fontSize: "18px", color: "#a3a3a3" }}>
          {" "}
          Nutrition tracker encourages you to not just count your calories but
          to focus on your nutrition as a whole{" "}
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
            header="INSTANT FOOD RECOGNITION
            "
            description="Simply upload a food photo and get the nutritional information of your meal.

            Our App is powered by our Food AI API. Food AI API is based on the latest innovations in deep learning and image classification technology to quickly and accurately identify food items."
          />
          
        </div>
      </div>

      </div>
    
    </>
  )
}

export default AIFeature