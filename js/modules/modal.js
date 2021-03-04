function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

console.log(modalTimerId);
    if(modalTimerId){
        clearInterval(modalTimerId);
    }
}
function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// document.querySelector('[data-close]').addEventListener('click', closeModal(modalSelector);

function modal(triggerSelector, modalSelector, modalTimerId) {
    //Modal

    const modal = document.querySelector(modalSelector),
    btns = document.querySelectorAll(triggerSelector);
    


btns.forEach(btn => {
    btn.addEventListener('click',() => openModal(modalSelector, modalTimerId));
});



modal.addEventListener('click', (event) => {
    if(event.target == modal || event.target.getAttribute('data-close')=='') {
        closeModal(modalSelector);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === "Escape" && modal.classList.contains('show')) { //СОБЫТИЕ КЛАВИАТУРЫ, КЛАВИША ESC
        closeModal(modalSelector);
    }
});



function showModalByScroll() {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
       openModal(modalSelector,modalTimerId);
    
    window.removeEventListener('scroll', showModalByScroll);
    }
}

window.addEventListener('scroll', showModalByScroll);

}

export {modal};
export {closeModal};
export {openModal};