export default class VideoPlayer {
    constructor(triggers, overlay){
        this.btns = document.querySelectorAll(triggers);
        this.overlay = document.querySelector(overlay);
        this.close = this.overlay.querySelector('.close');
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    }

    bindTriggers() {
        this.btns.forEach((btn, i) => {
            try {
                // сделаем неактивный каждый второй блок с видео
                const blockedElem = btn.closest('.module__video-item').nextElementSibling;

                if (i % 2 == 0) {
                    blockedElem.setAttribute('data-disabled', 'true');
                }
            } catch (error) {}

            btn.addEventListener('click', () => {
                // если блок не заблокировал, будем выполнять действия
                if (!btn.closest('.module__video-item') || 
                btn.closest('.module__video-item').getAttribute('data-disabled') !== 'true') {
                    this.activeBtn = btn;

                    // условие что б не создавать новый плеер (createPlayer)
                    if (document.querySelector('iframe#frame')) {
                        this.overlay.style.display = 'flex';

                        // условие что бы не создавать каждый раз новый плеер, если пользователь кликает на тоже самое видео
                        if (this.path !== btn.getAttribute('data-url')) {
                            this.path = btn.getAttribute('data-url');
                            this.player.loadVideoById({
                                videoId: this.path
                            });
                        }
                    } else {
                        this.path = btn.getAttribute('data-url');

                        this.createPlayer(this.path);
                    }
                }
            });
        });
    }

    bindCloseBtn() {
        this.close.addEventListener('click', () => {
            this.overlay.style.display = 'none';
            this.player.stopVideo();
        });
    }

    // создаем плеер на странице в зависимости от url
    createPlayer(url) {
        this.player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: `${url}`,
            events: {
                'onStateChange': this.onPlayerStateChange
            }
        });

        this.overlay.style.display = 'flex';
    }

    // функционал для отслеживания состояния видеоплеера(пауза, стоп и тд)
    onPlayerStateChange(state) {
        try {
            // получаем неактивный блок видеоплеера
            const blockedElem = this.activeBtn.closest('.module__video-item').nextElementSibling;
            // копируем svg иконку со всеми параметрами, что б в будущем заменить замочек в неактивном блоке
            const playBtn = this.activeBtn.querySelector('svg').cloneNode(true);

            // прописываем условия, когда пользоватеь досмотрел видео до конца(state.data ===0)
            if (state.data === 0) {
                // убираем/добавляем контент/стили
                if (blockedElem.querySelector('.play__circle').classList.contains('closed')) {
                    blockedElem.querySelector('.play__circle').classList.remove('closed');
                    blockedElem.querySelector('svg').remove();
                    blockedElem.querySelector('.play__circle').appendChild(playBtn);
                    blockedElem.querySelector('.play__text').textContent = 'play video';
                    blockedElem.querySelector('.play__text').classList.remove('attention');
                    blockedElem.style.opacity = 1;
                    blockedElem.style.filter = 'none';

                    blockedElem.setAttribute('data-disabled', 'false');
                }
            }
        } catch (error) {}
    }

    init() {
        if (this.btns.length > 0) {
            // подключаем youTube API
            const tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            this.bindTriggers();
            this.bindCloseBtn();
        }
    }
}