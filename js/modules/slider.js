import {getZero} from './timer';

function slider() {
      //Slider

      const slides = document.querySelectorAll('.offer__slide'),
      slider = document.querySelector('.offer__slider'),
      prev = document.querySelector('.offer__slider-prev'),
      next = document.querySelector('.offer__slider-next'),
      total = document.querySelector('#total'),
      current = document.querySelector('#current'),
      sliderWrapper = document.querySelector('.offer__slider-wrapper'),
      slidesField  = document.querySelector('.offer__slider-inner'),
      width = window.getComputedStyle(sliderWrapper).width;
  let slideIndex = 1;
  let offset = 0;
//          showSlides(slideIndex);
//         total.textContent = getZero(slides.length);


//         function showSlides(n) {
//             if (n > slides.length) {
//                 slideIndex = 1;
//             }
//             if(n < 1) {
//                 slideIndex = slides.length;
//             }
//             slides.forEach((item) => item.style.display = 'none');

//             slides[slideIndex - 1].style.display = 'block';

//             current.textContent = getZero(slideIndex);
//         }

//         function plusSlides(n) {
//             showSlides(slideIndex += n)
//         }
 
//         prev.addEventListener('click',() => {
//              plusSlides(-1);
//         });
//         next.addEventListener('click',() => {
//              plusSlides(1);
//         });

 // Slider 2nd version
 total.textContent = getZero(slides.length);
 current.textContent = getZero(slideIndex);

 slidesField.style.width = 100 * slides.length + '%';
 slidesField.style.display = 'flex';
 slidesField.style.transition = '0.5s all';

 sliderWrapper.style.overflow = 'hidden';

 slides.forEach(slide => {
     slide.style.width = width;
 });

 slider.style.position = 'relative';


 const indicators = document.createElement('ol'),
 dots = [];


 indicators.classList.add('carusel-indicators');

 indicators.style.cssText = `
     position: absolute;
     right: 0;
     bottom: 0;
     left: 0;
     z-index: 15;
     display: flex;
     justify-content: center;
     margin-right: 15%;
     margin-left: 15%;
     list-style: none;
 `;

 for(let i = 0; i < slides.length; i++) {
     const dot = document.createElement('li');
     dot.setAttribute('data-slide-to', i + 1);
     dot.style.cssText = `
         box-sizing: content-box;
         flex: 0 1 auto;
         width: 30px;
         height: 6px;
         margin-right: 3px;
         margin-left: 3px;
         cursor: pointer;
         background-color: #fff;
         background-clip: padding-box;
         border-top: 10px solid transparent;
         border-bottom: 10px solid transparent;
         opacity: .5;
         transition: opacity .6s ease;
 `;
 if(i==0) {
     dot.style.opacity = 1;
 }
     indicators.append(dot);
     dots.push(dot);
 }

 slider.append(indicators);

 function onlyDigits(str) {
     return +str.replace(/\D/g,'');
 }
 
 function dotsAndCurrent(){
     current.textContent = getZero(slideIndex);
     dots.forEach(dot => dot.style.opacity = '.5');
     dots[slideIndex - 1].style.opacity = 1;
 }  


 next.addEventListener('click', () => {
     if(offset == onlyDigits(width) * (slides.length -1)){
         offset = 0;
     } else {
         offset += onlyDigits(width);
     }

     slidesField.style.transform = `translateX(-${offset}px)`;

     if(slideIndex == slides.length){
         slideIndex = 1;
     } else {
         slideIndex++;
     }

     dotsAndCurrent();
 });

 prev.addEventListener('click', () => {
     if(offset == 0){
         offset = onlyDigits(width) * (slides.length -1);
     } else {
         offset -= onlyDigits(width);
     }

     slidesField.style.transform = `translateX(-${offset}px)`;

     if(slideIndex == 1){
         slideIndex = slides.length;
     } else {
         slideIndex--;
     }

     dotsAndCurrent();
 });

 dots.forEach(dot => {
     dot.addEventListener('click', (e) => {
         const slideTo = e.target.getAttribute('data-slide-to');

         slideIndex = slideTo;
         offset = onlyDigits(width) * (slideTo -1); 
         slidesField.style.transform = `translateX(-${offset}px)`;

         dotsAndCurrent();
     });
 });
}

export default slider;