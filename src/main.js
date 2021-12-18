import "./css/main.scss";
import Alpine from "alpinejs";
import Highway from "@dogstudio/highway";
import Tween, { gsap } from "gsap/all";
import LocomotiveScroll from "locomotive-scroll";
import Plyr from "plyr";
import Flickity from 'flickity';
import Splitting from 'splitting';

// Init anyway

// Locomotive Scroll
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  getDirection: true,
  direction: 'both'
});

// Alpine.js

window.Alpine = Alpine
Alpine.start()


// Highway Transition
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

const H = new Highway.Core({
  transitions: {
    default: Fade,
  },
});

// Highway events based on location
H.on('NAVIGATE_IN', ({ to, location}) => {
  const loc = to.view.getAttribute('data-router-view');

  switch(loc) {
    case "product": {
      window.Alpine = Alpine
      Alpine.start()

      // Try Flickity
      try {
        const slider = document.querySelector(".product__media__wrapper")

        if (slider) {
          const flkty = new Flickity(slider, {
            contain: true,
            cellAlign: 'left',
            wrapAround: true,
            pageDots: false,
            prevNextButtons: false,
            adaptiveHeight: true,
            setGallerySize: false
        
          })
        } else {
          console.log("Flickity: No slider found.")
        }
      } catch (error) {
        console.log(error)
      }

      // Try VariantSelector
      try {
        class VariantSelector extends HTMLElement {
          constructor() {
              super();
              this.addEventListener("change", this.onVariantChange);
          }
  
          onVariantChange() {
              this.getSelectedOptions()
              this.getSelectedVariant();
              if (this.currentVariant) {
                  this.updateURL();
                  this.updateFormID();
                  this.updatePrice();
                  this.updateButton();
              }
          }
  
          getSelectedOptions() {
              this.querySelectorAll('input').forEach(input => {
                  if (input.checked) {
                      this.options = input.value
                  }
              });
              console.log(this.options)
          }
  
          getVariantJSON() {
              this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
              return this.variantData;
          }
  
          getSelectedVariant() {
              this.getVariantJSON().forEach(variant => {
                  if (variant.title == this.options) {
                      this.currentVariant = variant
                  }
              });
              console.log(this.currentVariant)
          }
  
          updateButton() {
              if(!this.currentVariant) return;
              if (this.currentVariant.available) {
                  const atcButton = document.querySelector(".product__info__atc-button").removeAttribute("disabled")
              } else {
                  const atcButton = document.querySelector(".product__info__atc-button").setAttribute("disabled", "")
              }
          }
  
          updateURL() {
              if(!this.currentVariant) return;
              window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`)
          }
  
          updateFormID() {
              const form_input = document.querySelector("#product-form").querySelector('input[name="id"]');
              
              form_input.value = this.currentVariant.id;
          }
          updatePrice() {
              fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
              .then((response) => response.text())
              .then((responseText) => {
                  const id = `price-${this.dataset.section}`;
                  const html = new DOMParser().parseFromString(responseText, 'text/html');
                  const oldPrice = document.getElementById(id);
                  const newPrice = html.getElementById(id);
                  if(oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;
              });
          }
      }
      customElements.define("variant-selector", VariantSelector);
      } catch (error) {
        console.log("VariantSelector: Already initialized!")
      }
      break;
    }
    case "article": {
      console.log("article")
    }
  }
})

// Scripts on refresh

// Products Page

// Try Flickity
try {
  const slider = document.querySelector(".product__media__wrapper")

  if (slider) {
    const flkty = new Flickity(slider, {
      contain: true,
      cellAlign: 'left',
      wrapAround: true,
      pageDots: false,
      prevNextButtons: false,
      adaptiveHeight: true,
      setGallerySize: false
  
    })
  } else {
    console.log("Flickity: No slider found.")
  }
} catch (error) {
  console.log(error)
}

// Try VariantSelector
try {
    class VariantSelector extends HTMLElement {
      constructor() {
          super();
          this.addEventListener("change", this.onVariantChange);
      }

      onVariantChange() {
          this.getSelectedOptions()
          this.getSelectedVariant();
          if (this.currentVariant) {
              this.updateURL();
              this.updateFormID();
              this.updatePrice();
              this.updateButton();
          }
      }

      getSelectedOptions() {
          this.querySelectorAll('input').forEach(input => {
              if (input.checked) {
                  this.options = input.value
              }
          });
          console.log(this.options)
      }

      getVariantJSON() {
          this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
          return this.variantData;
      }

      getSelectedVariant() {
          this.getVariantJSON().forEach(variant => {
              if (variant.title == this.options) {
                  this.currentVariant = variant
              }
          });
          console.log(this.currentVariant)
      }

      updateButton() {
          if(!this.currentVariant) return;
          if (this.currentVariant.available) {
              const atcButton = document.querySelector(".product__info__atc-button").removeAttribute("disabled")
          } else {
              const atcButton = document.querySelector(".product__info__atc-button").setAttribute("disabled", "")
          }
      }

      updateURL() {
          if(!this.currentVariant) return;
          window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`)
      }

      updateFormID() {
          const form_input = document.querySelector("#product-form").querySelector('input[name="id"]');
          
          form_input.value = this.currentVariant.id;
      }
      updatePrice() {
          fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
              const id = `price-${this.dataset.section}`;
              const html = new DOMParser().parseFromString(responseText, 'text/html');
              const oldPrice = document.getElementById(id);
              const newPrice = html.getElementById(id);
              if(oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;
          });
      }
  }
  customElements.define("variant-selector", VariantSelector);
} catch (error) {
  console.log("VariantSelector: Already initialized!")
}




















// window.Alpine = Alpine

// Alpine.start()

// // const articleTitle = document.querySelector(".article__title h1");

// // const results = Splitting({
// //   target: articleTitle, 
// //   by: 'chars'
// // })

// // function setAttributes(el, attrs) {
// //   for(var key in attrs) {
// //     el.setAttribute(key, attrs[key]);
// //   }
// // }

// // let count = 1
// // let lerp = 0

// // results[0].chars.forEach(element => {
// //   setAttributes(element, {"data-scroll": "", "data-scroll-speed": count, "data-scroll-delay": lerp+=0.11})
// // });

// const scroll = new LocomotiveScroll({
//   el: document.querySelector("[data-scroll-container]"),
//   smooth: true,
//   getDirection: true,
//   direction: 'both'
// });

// // gsap.set('.layout_header_menu', {
// //     opacity: 0,
// //     autoAlpha: 0
// // })

// let transition = gsap.timeline({paused: true})

// function openNav() {
//   animateOpenNav();

//   const menuButton = document.getElementById("menu-open")
//   const menuLinks = document.querySelectorAll(".header__fullscreen a")
//   menuLinks.forEach(element => {
//     element.addEventListener("click", (e) => {
//       transition.reversed(!transition.reversed());
//     })
//   });
//   menuButton.addEventListener("click", (e) => {
//     transition.reversed(!transition.reversed());

//     menuButton.classList.toggle("active")
//   })


// }

// function animateOpenNav() {
//   transition.to('.header__fullscreen, #header', {
//       duration: .7,
//       autoAlpha: 1, 
//       ease: "power2.inOut",
//       color: "#F2E5D0"
//   }).reverse();
// }

// openNav();


// let fadeIn = gsap.timeline();

// gsap.set("[data-scroll-call='Fade']", {
//   autoAlpha: 0,
//   opacity: 0
// })

// scroll.on("scroll", (instance) => {
//   document.getElementById("header").setAttribute('data-direction', instance.direction)
// });


// scroll.on('call', (fun, dir, obj) => {
//   fadeIn.to(obj.el, {
//     autoAlpha: 1,
//     opacity: 1,
//     duration: 0.2,
//     stagger: 0.01,
//     ease: "power2.inOut"
//   })
// })

// class Fade extends Highway.Transition {
//   in({ from, to, done}) {
//     scroll.scrollTo(0,0)

//     from.remove();

//     Tween.fromTo(to, {
//       autoAlpha: 0,
//       opacity: 1,
//       y: '80px'
//     },{
//       autoAlpha: 1,
//       opacity: 1,
//       y: '0px',
//       duration: 1,
//       delay: .5,
//       ease: "power2.inOut",
//       onComplete: done, function() {
//         scroll.destroy();
//         scroll.init();
//         let fadeIn = gsap.timeline();
//         gsap.set("[data-scroll-call='Fade']", {
//           autoAlpha: 0,
//           opacity: 0
//         })
//         scroll.on("scroll", (instance) => {
//           document.getElementById("header").setAttribute('data-direction', instance.direction)
//       });
//         scroll.on('call', (fun, dir, obj) => {
//           fadeIn.to(obj.el, {
//             autoAlpha: 1,
//             opacity: 1,
//             duration: 0.2,
//             stagger: 0.01,
//             ease: "power2.inOut"
//           })
//         })
//       }
//     })
//   }

//   out({ from, done }) {
//     Tween.to(from, {
//       autoAlpha: 0,
//       opacity: 0,
//       y: '-80px',
//       duration: 1,
//       ease: "power2.inOut",
//       onComplete: done, function() {
//         scroll.scrollTo(0,0)
//       }
//     });
//   }
// }

// export default Fade;

// const H = new Highway.Core({
//   transitions: {
//     default: Fade,
//   },
// });
// const slider = document.querySelector(".product__media__wrapper")
// const flkty = new Flickity(slider, {
//   contain: true,
//   cellAlign: 'left',
//   wrapAround: true,
//   pageDots: false,
//   prevNextButtons: false,
//   adaptiveHeight: true,
//   setGallerySize: false

// })

// const buttz = document.querySelectorAll('.product__info__accordion__section button')

// buttz.forEach(element => {
//   element.addEventListener("click", () => {
//     flkty.resize()
//   })
// });

// H.on('NAVIGATE_IN', ({ to, location}) => {
//   const loc = to.view.getAttribute('data-router-view');

//   switch(loc) {
//     case "product":
//       const slider = document.querySelector(".product__media__wrapper")
//       const flkty = new Flickity(slider, {
//         contain: true,
//         cellAlign: 'left'
//       })
//       break;
    
//   }
// })
// H.on('NAVIGATE_OUT', ({ to, location}) => {
//   transition.to('.header__fullscreen', {
//     autoAlpha: 0,
//     opacity: 1,
//     duration: .7,
//     ease: "power2.inOut"
//   })
// })

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

// const player = new Plyr("#player", {

// })


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
