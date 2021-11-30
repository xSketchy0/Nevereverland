import "./css/main.scss";
import Alpine from "alpinejs";
import Highway, { Renderer } from "@dogstudio/highway";
import Tween, { gsap, ScrollTrigger } from "gsap/all";
import LocomotiveScroll from "locomotive-scroll";
import Plyr from "plyr";

const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  getDirection: true,
  resetNativeScroll: true,
});

// gsap.set('.layout_header_menu', {
//     opacity: 0,
//     autoAlpha: 0
// })

let transition = new gsap.timeline()
.to('.layout_header_menu', {
    duration: .7,
    autoAlpha: 1, 
    opacity: 1,
    ease: "power2.inOut"
}).reverse();

// const menuButton = document.getElementById("menu-open")

// menuButton.addEventListener('click', (e) => {
//     transition.reversed(!transition.reversed());
// }) 


let fadeIn = gsap.timeline();

gsap.set("[data-scroll-call='Fade']", {
  autoAlpha: 0,
  opacity: 0
})

scroll.on("scroll", (instance) => {
  document.getElementById("header").setAttribute('data-direction', instance.direction)
});


scroll.on('call', (fun, dir, obj) => {
  fadeIn.to(obj.el, {
    autoAlpha: 1,
    opacity: 1,
    duration: 0.2,
    stagger: 0.01,
    ease: "power2.inOut"
  })
})

class Fade extends Highway.Transition {
  in({ from, to, done}) {
    scroll.scrollTo(0,0)

    from.remove();

    Tween.fromTo(to, {
      autoAlpha: 0,
      opacity: 1,
      y: '80px'
    },{
      autoAlpha: 1,
      opacity: 1,
      y: '0px',
      duration: 1,
      delay: .5,
      ease: "power2.inOut",
      onComplete: done, function() {
        scroll.destroy();
        scroll.init();
        let fadeIn = gsap.timeline();
        gsap.set("[data-scroll-call='Fade']", {
          autoAlpha: 0,
          opacity: 0
        })
        scroll.on("scroll", (instance) => {
          document.getElementById("header").setAttribute('data-direction', instance.direction)
      });
        scroll.on('call', (fun, dir, obj) => {
          fadeIn.to(obj.el, {
            autoAlpha: 1,
            opacity: 1,
            duration: 0.2,
            stagger: 0.01,
            ease: "power2.inOut"
          })
        })
      }
    })
  }

  out({ from, done }) {
    Tween.to(from, {
      autoAlpha: 0,
      opacity: 0,
      y: '-80px',
      duration: 1,
      ease: "power2.inOut",
      onComplete: done, function() {
        scroll.scrollTo(0,0)
      }
    });
  }
}

export default Fade;

const H = new Highway.Core({
  transitions: {
    default: Fade,
  },
});

// let images = document.querySelectorAll("img, iframe")

// images.forEach(element => {
//   element.addEventListener('')
// });


// const header = document.querySelector('.header-menu');

// H.on('NAVIGATE_IN', ({ to, location }) => {

//     const current = to.page.querySelector('[data-router-view]').getAttribute('data-router-view')
//     if (current != 'index') {
//         header.classList.add('dark')
//     } else {
//         header.classList.remove('dark')
//     }
//     console.log(current)
//     // Check Active Link
//     // for (let i = 0; i < links.length; i++) {
//     //   const link = links[i];
  
//     //   // Clean class
//     //   link.classList.remove('is-active');
  
//     //   // Active link
//     //   if (link.href === location.href) {
//     //     link.classList.add('is-active');
//     //   }
//     // }
//   });

const player = new Plyr("#player", {

})


// function scrollFunction() {
//   if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
//     // document.getElementById("header").style.backgroundColor = "#f2e5d0"
//     document.getElementById("header").style.color = "#2A2323";
//     // document.getElementById("header").style.borderBottom = "1px solid #f2e5d0"
//     document.getElementById("header_logo").classList.remove("w-36");
//     document.getElementById("header_logo").classList.add("w-16");
//   } else {
//     // document.getElementById("header").style.backgroundColor = "transparent"
//     document.getElementById("header").style.color = "#f2e5d0";
//     // document.getElementById("header").style.borderBottom = "none"
//     document.getElementById("header_logo").classList.remove("w-16");
//     document.getElementById("header_logo").classList.add("w-36");
//   }
// }

// window.onscroll = function () {
//   scrollFunction();
// };

// let playvid = document.getElementById("#play-video");

// playvid.addEventListener('click', () => {
//   console.log("test")
// })

// let play = document.querySelector("#play-video")
// let video = document.querySelector("iframe")

// play.addEventListener('click', (e) => {
//   video.src += "&autoplay=1";
//   e.preventDefault();
// })
