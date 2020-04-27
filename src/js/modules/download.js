export default class Download {
    constructor(triggers) {
        this.btns = document.querySelectorAll(triggers);
        this.path = 'assets/img/Bitmap.jpg';
    }

    // метод, который отвечает за формирование запроса на скачивание файла
    downloadItem(path) {
        // создаем виртуальный элемент ссылки и добавляем его страницу
        const link = document.createElement('a');

        link.setAttribute('href', path);
        link.setAttribute('download', 'picture');


        link.style.display = 'none';
        document.body.appendChild(link);
        
        link.click();
    }

    init() {
        this.btns.forEach(btn => {
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', () => {
                this.downloadItem(this.path);
            });
        });
    }
}