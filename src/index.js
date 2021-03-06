import initStage from './stage'
import Engine from './engine'
import { EVENTS } from './constants'
import audio from './audio'

const retryParam = 'skipstart=t'


const game = {
  start() {
    this.context = initStage('#gameStage')
    this.canvas = this.context.canvas
    const hud = document.getElementById('hud')
    const assets = this.getAssets()
    this.engine = new Engine(this.context, hud, assets)

    // Add Events
    this._gameFailScreen = this.gameFailScreen.bind(this)
    this._gameWinScreen = this.gameWinScreen.bind(this)
    this.canvas.addEventListener(EVENTS.GAME_OVER, this._gameFailScreen)
    this.canvas.addEventListener(EVENTS.GAME_WIN, this._gameWinScreen)

    // Start game loop
    this.engine.start()
  },
  getAssets() {
    return [
      'battery-pickup',
      'ethernet-port',
      'ethernet',
      'nowifi',
      'robot',
      'player',
      'pattern-obstacle',
    ].reduce((obj, assetName) => {
      obj[assetName] = document.getElementById(assetName)
      return obj
    }, {})
  },
  gameFailScreen() {
    this.canvas.removeEventListener(EVENTS.GAME_OVER, this._gameFailScreen);
    audio.fail()
    this.engine.stop();

    closeCurrentScreen();
    const retryBtn = document.getElementById('retryBtn')
    const exitBtn = document.getElementById('exitBtn')
    retryBtn.addEventListener('click', () => {
      if(urlHasRetry()) window.location.reload()
      else window.location.href += `?${retryParam}`
    })
    exitBtn.addEventListener('click', () => {
      window.location.href = `${window.location.origin}${window.location.pathname}`
    })
    const retryScreen = document.getElementById('retryScreen')
    retryScreen.classList.add('is-active');
  },

  gameWinScreen() {
    this.engine.stop()
    audio.win()
    closeCurrentScreen()
    const winScreen = document.getElementById('completeScreen')
    winScreen.classList.add('is-active')
  }
}





// Screen initializers
function initStartScreen(){
  if(urlHasRetry()) return game.start();

  const ss = document.getElementById('startScreen')
  ss.classList.add('is-active');
  ss.querySelector('#playBtn').addEventListener('click', () => {
    closeCurrentScreen();
    game.start();
  })
}

function closeCurrentScreen() {
  const currentScreen = document.querySelector('.screen-state.is-active')
  if(currentScreen) currentScreen.classList.remove('is-active')
}

function urlHasRetry() {
  return window.location.search.includes(retryParam)
}


window.game = game // For debugging
initStartScreen()
