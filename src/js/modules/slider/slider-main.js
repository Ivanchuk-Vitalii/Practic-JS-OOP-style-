import Slider from './slider';

export default class MainSlider extends Slider {
    constructor(btns, nextModule, prevModule) {
        // с помощью super в МainSlider появляються свойства this.btns
        super(btns, nextModule, prevModule);
    }

    showSlides(n) {
        // если n больше чем количество слайдов, возвращаем слайдер в начало; если меньше - показываем последний слайд
        if (n > this.slides.length) {
            this.slideIndex = 1;
        }

        if (n < 1) {
            this.slideIndex = this.slides.length;
        }

        // всплывающий блок hanson должен появится через некоторое время и только на одной странице
        try {
            this.hanson.style.opacity = '0';

            if (n === 3) {
                this.hanson.classList.add('animated');
                setTimeout(() => {
                    this.hanson.style.opacity = '1';
                    this.hanson.classList.add('slideInUp');
                }, 3000);
            } else {
                this.hanson.classList.remove('slideInUp');
            }
        } catch (error) {

        }

        // скрываем все слайды и оставляем только один для отображения на странице
        this.slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.add('animated');
        });

        this.slides[this.slideIndex - 1].style.display = 'block';
    }
    // метод переключения слайдов
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    bindTriggers() {
        this.btns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.plusSlides(1);
                this.slides[this.slideIndex - 1].classList.remove('slideInLeft', 'slideInRight');
                this.slides[this.slideIndex - 1].classList.add('slideInUp');
            });

            // при клике на иконку будет показан первый слайд
            btn.parentNode.previousElementSibling.addEventListener('click', (e) => {
                e.preventDefault();
                this.slideIndex = 1;
                this.slides[this.slideIndex - 1].classList.remove('slideInUp', 'slideInLeft', 'slideInRight');
                this.slides[this.slideIndex - 1].classList.add('fadeIn');
                this.showSlides(this.slideIndex);
            });
        });

        // переключение модулей влево/вправо
        this.prevModule.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // останавливаем всплытие
                e.preventDefault();
                
                this.plusSlides(-1);
                this.slides[this.slideIndex - 1].classList.remove('fadeIn', 'slideInUp', 'slideInRight');
                this.slides[this.slideIndex - 1].classList.add('slideInLeft');

            });
        });

        this.nextModule.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                this.plusSlides(1);
                this.slides[this.slideIndex - 1].classList.remove('fadeIn', 'slideInUp', 'slideInLeft');
                this.slides[this.slideIndex - 1].classList.add('slideInRight');
            });
        });
    }

    render() {
        if (this.container) {
            try {
                this.hanson = document.querySelector('.hanson');
            } catch (error) {}

            this.showSlides(this.slideIndex);
            this.bindTriggers(); 
        } 
    }
}