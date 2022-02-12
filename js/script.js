window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }
    
    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabsContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabsContent();
                    showTabContent(i);
                }
                
            });
        }
    });


    //timer

    const deadline = '2022-09-14';
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), //Date.parse() -  превращает в милисекунды
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor(t / (1000 * 60 * 60) % 24),
              minutes = Math.floor(t / (1000 * 60) % 60),
              seconds = Math.floor(t / (1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

// Функция, которая устанавливает таймер на страницу
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
              updateClock();
        // Функция для обновления часов
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML =  getZero(t.hours);
            minutes.innerHTML =  getZero(t.minutes);
            seconds.innerHTML =  getZero(t.seconds);
            if(t.total <= 0) {
                clearInterval(timeInterval);
                days.innerHTML = '0';
                hours.innerHTML = '0';
                minutes.innerHTML = '0';
                seconds.innerHTML = '0';
            }
        }
        function getZero(num) {
            if(num >= 0 && num < 10) {
                return `0${num}`;
            }else{
                return num;
            }
        }
    }
    setClock('.timer', deadline);

    // modal
    const modalTrigger = document.querySelectorAll('button[data-modal]'),
          modalClose = document.querySelector('[data-closeModal]'),
          modalWindow = document.querySelector('.modal');
    function modalActive(){
        document.body.style.overflow = 'hidden';
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        clearInterval(modalTimer);
    }
    modalTrigger.forEach(item => {
            item.addEventListener('click', () => {
                modalActive();
            });
    });
    modalClose.addEventListener('click', closeModal);
    function closeModal() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
        document.querySelector('.modal__dialog').classList.add('show');
        document.querySelector('.modal__dialog').classList.remove('hide');
    }

    modalWindow.addEventListener('click', e => {
        if(e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    document.addEventListener('keydown', e => {
        if(e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimer = setTimeout(modalActive, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 1) {
            modalActive();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Шаблонизация создания карточек с меню на странице 

    const contain = document.querySelector('.menu__field .container');
    class CreateBlock {
        constructor(jpg, alt, name, descr, price, parentSelector, ...classes){
            this.jpg = jpg;
            this.alt = alt;
            this.name = name;
            this.classes = classes;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
        }

        addMenu(){   
            const block = document.createElement(`div`);
            if(this.classes.length === 0){
                this.classes = block.classList.add('menu__item');
            }else{
                this.classes.forEach(className => block.classList.add(className));            
            }


            block.innerHTML = `
                <img src="${this.jpg}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">Меню "${this.name}"</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>`;
            this.parent.append(block);
        }
    }

    const getData = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };
    
    getData('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new CreateBlock(img, altimg, title, descr, price, '.menu .container').addMenu();
            });
        });

    // forms

    const forms = document.querySelectorAll('form');
    const mess = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusMessage = document.createElement('img');
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            statusMessage.src = mess.loading;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const object = {};
            formData .forEach((value, key) => {
                object[key] = value;
            });

            postData('http://localhost:3000/requests', JSON.stringify(object))
            .then(data => {
                console.log(data);
                thanksModal(mess.success);

                statusMessage.remove();
            })
            .catch(() => {
                thanksModal(mess.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    } 


    function thanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        modalActive();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            document.querySelector('.modal__dialog').classList.add('show');
            document.querySelector('.modal__dialog').classList.remove('hide');
            closeModal();
        }, 2000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

    // slider

    let imgBlock = document.querySelectorAll('.offer__slide'),
          lArrow = document.querySelector('.offer__slider-prev'),
          rArrow = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width,
          slider = document.querySelector('.offer__slider');

    // clearSlider();
    // scroll();

    // function clearSlider() {
    //     imgBlock.forEach(item => {
    //         item.style.display = 'none';
    //     });

    //     imgBlock.length < 10 ? total.innerHTML = `0` + imgBlock.length : total.innerHTML = imgBlock.length;
    //     current.innerHTML = `01`;
    // }
    // function scroll(index = 0) {
    //     imgBlock.forEach(img => {
    //         if (img == imgBlock[index]) {
    //             img.style.display = 'block';
    //             imgBlock.length < 10 ? current.innerHTML = '0' + (index + 1) : current.innerHTML = index + 1;
    //         } else {
    //             img.style.display = 'none';
    //         }
    //     });
    // }
    
    // let counter = 0;
    // rArrow.addEventListener('click', () => {       
    //     if (counter >= imgBlock.length - 1) {
    //         counter = -1;
    //     }
    //     counter++;
    //     scroll(counter);
    // });
    // lArrow.addEventListener('click', () => {
    //     if (counter <= 0) {
    //         counter = imgBlock.length;
    //     }
    //     counter--;
    //     scroll(counter);
    // });

    let slideIndex = 1,
    offset = 0,
    dots =[];

    if (imgBlock.length < 10) {
        total.textContent = `0${imgBlock.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = imgBlock.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * imgBlock.length + '%';
    slidesField.style.display ='flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    imgBlock.forEach(item => {
        item.style.width = width;
    });

    rArrow.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (imgBlock.length - 1)){
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == imgBlock.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (imgBlock.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(item => item.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    
    });

    lArrow.addEventListener('click', () => {
        if (offset == 0){
            offset = +width.slice(0, width.length - 2) * (imgBlock.length - 1);
            
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = imgBlock.length;
        } else {
            slideIndex--;
        }

        if (imgBlock.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(item => item.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');

    slider.appendChild(indicators);

    for (let i = 0; i < imgBlock.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        indicators.append(dot);

        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;

            offset = +width.slice(0, width.length - 2) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            dots.forEach(item => item.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;

            if (imgBlock.length < 10) {
                total.textContent = `0${imgBlock.length}`;
                current.textContent = `0${slideIndex}`;
            } else {
                total.textContent = imgBlock.length;
                current.textContent = slideIndex;
            }
        });
    });

    // calc

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

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || ! weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        } 
    }
    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }        
    
    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')){
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

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
});