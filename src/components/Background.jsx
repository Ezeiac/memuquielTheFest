import React from 'react'
import '../styles/background.css'
import mundo from '../assets/images/Earth.png'

export const Background = () => {
  return (
<div className="slider">
  <div className="slide-track">
    <img src={mundo} alt="" />
    <img src={mundo} alt="" />
    <img src={mundo} alt="" />
    <img src={mundo} alt="" />
  </div>
</div>

  )
}
