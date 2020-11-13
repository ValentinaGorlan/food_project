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
         if(num >+0 && num < 10) {
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
        modal.classList.toggle('show');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
    }

    btns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    close.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if(event.target == modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && modal.classList.contains('show')) { //СОБЫТИЕ КЛАВИАТУРЫ, КЛАВИША ESC
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000);

    window.addEventListener('scroll', () => {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1){
            openModal();
        }
    });

});