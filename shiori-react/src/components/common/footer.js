import * as React from 'react';
import icon from '../../assets/images/icon.png';


export default function Footer() {
  return (
    <footer 
    className='p-8 bg-green-1'
    >
      <a href="">
        <img src={icon} alt="icon" 
          className='h-10 w-auto'
        />
      </a>

    </footer>
  )
}