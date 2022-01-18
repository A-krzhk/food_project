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

    function closeModal() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    modalWindow.addEventListener('click', e => {
        if(e.target === modalWindow) {
            closeModal();
        }
    });
    document.addEventListener('keydown', e => {
        if(e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimer = setTimeout(modalActive, 10000);

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
    new CreateBlock('img/tabs/vegy.jpg', 'vegy', 'Фитнес',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
     229, '.menu__field .container').addMenu();
    new CreateBlock('img/tabs/elite.jpg', 'elite', 'Премиум',
     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      550,'.menu__field .container').addMenu();
    new CreateBlock('img/tabs/post.jpg', 'post', 'Постное',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    430,'.menu__field .container').addMenu();
});
