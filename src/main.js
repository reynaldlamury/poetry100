import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);

import Sketch from './app.js';

let animation = new Sketch({
  dom: document.getElementById('container'),
});

gsap.to(animation.settings, {
  duration: 3.3,
  progress: 1,
  ease: 'expo.inOut',
});

let wrapper = document.getElementById('wrapper');

gsap.to('.wrapper', {
  x: -(wrapper.scrollWidth - document.documentElement.clientWidth) + 'px',
  // x: "-1000px",
  scrollTrigger: {
    trigger: '#container',
    pin: true,
    scrub: 2,
    // onUpdate: (self) => {
    //     animation.time = self.progress*20*-1;
    //     // console.log(animation.time)

    // }
  },
});

let border = document.getElementById('d');

function raf() {
  let borderLeft = border.getBoundingClientRect().left;
  animation.time = borderLeft * 0.01;
  window.requestAnimationFrame(raf);
}
raf();
