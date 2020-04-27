export default class ShowInfo {
    constructor(triggers) {
        this.btns = document.querySelectorAll(triggers);
    }

    init() {
        this.btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // находим скрытый контент и показываем/скрываем его при клике на плюс
                const sibling = btn.closest('.module__info-show').nextElementSibling;
                
                btn.style.display = 'none';

                sibling.style.display = 'block';
                sibling.classList.add('animated', 'fadeInUp');
            });
        });
    }
}