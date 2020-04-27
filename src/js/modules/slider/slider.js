export default class Slider {
    // слайдер делаем на две страници
    // в конструктор помещаем свойства, которые характеризуют слайдер на начальном этапе,
    constructor({
        container = null,
        btns = null,
        next = null,
        prev = null,
        nextModule = null,
        prevModule = null,
        activeClass = '',
        animate,
        autoplay } = {}) {
        this.container = document.querySelector(container);
        try {
            this.slides = this.container.children; // получаем все слайды внутри container
        } catch (error) {}
        this.btns = document.querySelectorAll(btns);
        this.next = document.querySelector(next);
        this.prev = document.querySelector(prev);
        this.nextModule = document.querySelectorAll(nextModule);
        this.prevModule = document.querySelectorAll(prevModule);
        this.activeClass = activeClass;
        this.animate = animate;
        this.autoplay = autoplay;
        this.slideIndex = 1;
    }

    
}