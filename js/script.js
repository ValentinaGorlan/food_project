window.addEventListener('DOMContentLoaded', () => {

    //Tabs
    
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
     });

     //Timer

     const deadLine = '2020-12-11';

     function getTimeRemaining(endtime){
         const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 *60* 24)),
            hours = Math.floor((t / (1000 * 60 *60)) % 24),
            minutes = Math.floor((t/1000/60) % 60),
            seconds = Math.floor((t/1000) % 60);

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
     }

     function getZero(num) {
         if(num >=0 && num < 10) {
             return `0${num}`;
         } else {
             return num;
         }
     }

     function setClock(selector, endtime) {
         const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

            updateClock();

            function updateClock() {
                const t = getTimeRemaining(endtime);

                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if(t.total <=0) {
                    clearInterval(timeInterval);
                }         
            }
     }

     setClock('.timer', deadLine);

     //Modal

     const modal = document.querySelector('.modal'),
        btns = document.querySelectorAll('[data-modal]'),
        close = document.querySelector('[data-close]');


    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');

            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
    }

    btns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // close.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if(event.target == modal || event.target.getAttribute('data-close')=='') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && modal.classList.contains('show')) { //СОБЫТИЕ КЛАВИАТУРЫ, КЛАВИША ESC
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 100000000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
        
        window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);



    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr= descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 76;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
        }

        render() {
            const elem = document.createElement('div');
            if (this.classes.length ===0){
                this.elem = 'menu__item',
                elem.classList.add(this.elem);
            } else {
                this.classes.forEach(className => elem.classList.add(className));
            }

            elem.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                 <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
            </div>
        `;
        this.parent.append(elem);
        }
    }

    const getResource = async (url) => {
        const res = await fetch( url);

        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };


    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    // библиотека axios
    axios.get('http://localhost:3000/menu')
    .then(data => {

            data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
    });

    // POST Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success:'Спасибо! Скоро мы с вами свяжемся.',
        failure: 'Что-то пошло не так...'

    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch( url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend',statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const previosModalDialod = document.querySelector('.modal__dialog');

        previosModalDialod.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
         </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            previosModalDialod.classList.add('show');
            previosModalDialod.classList.remove('hide');
            closeModal();
        },4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json());
        // .then(res => console.log(res));


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

        //Calculator

            const result = document.querySelector('.calculating__result span');

            let sex, height, weight, age, ratio;

            

            if (localStorage.getItem('sex')) {
                sex = localStorage.getItem('sex');
            } else {
                sex = 'female';
                localStorage.setItem('sex', 'female');
            }

            if (localStorage.getItem('ratio')) {
                ratio = localStorage.getItem('ratio');
            } else {
                ratio = 1.375;
                localStorage.setItem('ratio', 1.375);
            }

            function initLocalSettings(selector, activClass) {
                const elems = document.querySelectorAll(selector);

                elems.forEach(elem => {
                    elem.classList.remove(activClass);

                    if (elem.getAttribute('id') === localStorage.getItem('sex')){
                        elem.classList.add(activClass);
                    }
                    if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                        elem.classList.add(activClass);
                    }
                });

                
            }

        initLocalSettings("#gender div", "calculating__choose-item_active");
        initLocalSettings(".calculating__choose_big div","calculating__choose-item_active");

        function calcTotal() {
            if (!sex || !height || !weight || !age || !ratio) {
                result.textContent = '____';
                return;
            }
            
            if(sex === 'female'){
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age))*ratio);
            }else {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age))*ratio);
            }
        } 

        calcTotal();

        function getStaticInformation(selector, activClass){
            const elems = document.querySelectorAll(selector);

            elems.forEach(elem => {
                elem.addEventListener('click', (e) => {
                    if(e.target.getAttribute('data-ratio')) {
                        ratio = +e.target.getAttribute('data-ratio');
                        localStorage.setItem('ratio',+e.target.getAttribute('data-ratio'));
                    } else {
                        sex = e.target.getAttribute('id');
                        localStorage.setItem('sex', e.target.getAttribute('id'));
                    }
    
                    console.log(ratio, sex);
    
                    elems.forEach(elem => {
                    elem.classList.remove(activClass);
                    });
                    e.target.classList.add(activClass);
    
                    calcTotal();
                });
            });
        }

        getStaticInformation("#gender div", "calculating__choose-item_active");
        getStaticInformation(".calculating__choose_big div","calculating__choose-item_active");

        function getDynamicInformation(selector) {
            const input = document.querySelector(selector);

            input.addEventListener('input' , () => {
                if(input.value.match(/\D/g)) {
                    input.style.border = '1px solid red';
                } else {
                    input.style.border = 'none'; 
                }

                switch(input.getAttribute('id')) {
                    case 'height':
                        height = +input.value;
                        break;

                    case 'weight':
                        weight = +input.value;
                        break;

                    case 'age':
                        age = +input.value;
                        break;
                }

                calcTotal();
            });
            
        }

        getDynamicInformation("#height");
        getDynamicInformation("#weight");
        getDynamicInformation("#age");
});


