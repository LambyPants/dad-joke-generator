/* eslint-disable no-return-assign */
/* eslint-disable class-methods-use-this */
const css = (arg) => arg;
const html = (arg) => arg;

export default class DadJoke {
  constructor(setup, punchline) {
    this.setup = setup;
    this.punchline = punchline;
  }

  // Getter
  get backdropStyle() {
    return css`
      :host {
        opacity: 1;
        transition: opacity 0.5s ease;
        cursor: pointer;
        display: block;
      }

      :host([fade]) {
        opacity: 0;
      }

      img {
        position: fixed;
        left: 0;
        bottom: 0;
        width: auto;
        height: auto;
        max-height: 400px;
        z-index: 99999999999999999999;
        animation: dad 0.3s ease-in;
      }
      .bubble {
        font-family: sans-serif;
        font-size: 18px;
        line-height: 24px;
        width: 300px;
        background: #fff;
        border-radius: 40px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
          0 10px 10px rgba(0, 0, 0, 0.22);
        color: #000;
        position: fixed;
        bottom: 355px;
        z-index: 99999999999999999999;
        left: 100px;
        animation: setup 1s ease-in;
      }

      .bubble:before {
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        z-index: 99999999999999999999;
        border-left: 24px solid #fff;
        border-right: 12px solid transparent;
        border-top: 12px solid #fff;
        border-bottom: 20px solid transparent;
        left: 32px;
        bottom: -24px;
      }
      em,
      strong {
        display: block;
        margin: 0;
      }
      em {
        margin-bottom: 5px;
        animation: setup 1s ease-in;
      }
      strong {
        margin-top: 5px;
        animation: punchline 2.5s ease-in;
      }

      @keyframes setup {
        0% {
          opacity: 0;
        }
        60% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes punchline {
        0% {
          opacity: 0;
        }
        80% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes dad {
        0% {
          transform: translateX(-100%);
        }
        80% {
          transform: translateX(10px);
          transform: skew(-5deg, -5deg);
        }
        100% {
          transform: translateX(0);
          transform: skew(0, 0);
        }
      }
    `;
  }

  // Method
  init() {
    this.widget = document.createElement('dad-joke');
    this.widget.attachShadow({ mode: 'open' });
    const shadow = this.widget.shadowRoot;
    const style = document.createElement('style');
    style.textContent = this.backdropStyle;
    shadow.appendChild(style);
    this.drawUI(shadow);
    document.body.appendChild(this.widget);
    this.widget.addEventListener('click', () => {
      console.log('daddo click');
      this.widget.dispatchEvent(
        new CustomEvent('dad-joke-click', {
          bubbles: true,
          composed: true,
        }),
      );
    });
    return this.widget;
  }

  drawUI(shadow) {
    const mrTurner = document.createElement('img');
    const chatBubble = document.createElement('div');
    chatBubble.classList.add('bubble');
    // need this to access a extension resource
    mrTurner.src = chrome.runtime.getURL('mrTurner.png');
    // setup in italics
    const setup = document.createElement('em');
    // punchline in bold
    const punchline = document.createElement('strong');
    setup.innerText = this.setup;
    punchline.innerText = this.punchline;
    chatBubble.append(setup);
    chatBubble.append(punchline);
    shadow.append(mrTurner);
    shadow.append(chatBubble);
  }

  fadeAway() {
    this.widget.setAttribute('fade', '');
  }

  remove() {
    document.body.removeChild(this.widget);
    this.widget = undefined;
  }
}
