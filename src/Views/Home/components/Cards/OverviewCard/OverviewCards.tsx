import React from 'react'
import colors from '../../../../../assets/Css/color';

interface OverviewCardsProps {
  header: string;
  description: string;
  // image: string;
  className?: string;   
}
const OverviewCards:React.FC<OverviewCardsProps> = (props) => {

    const {header,description} = props
  return (
   <>
       <div className='cards-decription' style={{width:"500px", height:"250px"}}>
        <h3 style={{color: colors.greyColor3, fontSize:"23px",textAlign:"center"}}>  {header} </h3>
        <p style={{color:"#a3a3a3",fontSize:"17px",textAlign:"center"}}> {description}</p>
            {/* <img src={image}  style={{width:"150px", height:"100px", }}alt="" /> */}
        </div>

   </>
  )
}

export default OverviewCards