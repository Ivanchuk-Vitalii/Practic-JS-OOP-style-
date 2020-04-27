export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Loading...',
            success: 'Thank you! Soon we call you',
            failure: 'Somesing wrong',
        };
        this.path = {
            question: 'assets/question.php'
        };
    }

    // очищаем инпуты после сабмита
    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    // валидация email инпутов 
    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');

        mailInputs.forEach(input => {
            // проверяем на соответсвие с помощью регулярных выражений, что б пользователь мог вводить только на en раскладке и что б валидация была по @ и точке (например: mail@gmail.com)
            input.addEventListener('keypress', function (e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    e.preventDefault();
                }
            });
        });
    }

    // маска телефона
    mask() {

        let setCursorPosition = (pos, elem) => {
            // устанавливаем фокус на елементе и в опреденной позиции с помощью setSelectionRange
            elem.focus();

            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) { // полифил для IE
                let range = elem.createTextRange();

                // обьеденяет граничные точки диапазона
                range.collapse(true);
                // говорим коду, где будет конечная точка выделения
                range.moveEnd('charaster', pos);
                // говорим коду, где будет начальная точка выделения
                range.moveStart('charaster', pos);
                // установим курсор и выделем то значение которое сформировалось при помощи moveEnd moveStart
                range.select();
            }

        };

        function createMask(event) {
            let matrix = '+1 (___) ___ __ __',
                i = 0,
                // получаем все не цифры и заменяем их на пустое поле
                def = matrix.replace(/\D/g, ''), // стат. значение, работает на основе матрици
                val = this.value.replace(/\D/g, ''); // динамическое значение, работает на основе того что ввел пользователь

            if (def.length >= val.length) {
                val = def;
            }

            // заменям нижние подчеркивания в матрице значениями, которые ввел пользователь
            this.value = matrix.replace(/./g, function (a) {
                //формируем ту строке, которую покажем пользователю, проверяем являеться ли данный символ елементом, который входит в определенный диапазон
                // а - каждый символ, который перебирается внутри матрици
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });

            // если пользователь убрал фокус с инпута и ничего не ввел в поле, то скрываем маску, в ином случае нам нужно установить курсор куда нам нужно
            if (event.type == 'blur') {
                if (this.value.length == 3) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }

        // получаем елементы, на которые нужно установить маску
        let inputs = document.querySelectorAll('[name="phone"]');

        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });

    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    }


    init() {
        // функционал когда пользователь отправляет форму
        this.checkMailInputs();
        this.mask();
        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                // после сабмита будет скрыватся форма и будет показыватся статус отправки c задаными стилями
                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                margin-top: 15px;
                font-size: 18px;
                color: orange;
                `;
                item.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                // формируем данные и отправляем их на сервер
                const formData = new FormData(item);
                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 3000);
                    });
            });
        });
    }
}