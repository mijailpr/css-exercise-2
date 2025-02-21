import './style.css'
import { RoomsContainer } from './components/RoomsContainer/RoomsContainer'
import { KitchenView } from './components/KitchenView/KitchenView'
import { Header } from './components/Header/Header'

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="page-wrapper">
    <div id="mainContent"></div>
  </div>
`

const pageWrapper = document.querySelector('.page-wrapper')
pageWrapper.insertBefore(Header(), pageWrapper.firstChild)

const roomsBtn = document.querySelector('a.nav-btn[href="#salas-de-juego"]')
const snakesBtn = document.querySelector('a.nav-btn[href="#snakes"]')
const mainContent = document.querySelector('#mainContent')

function showRooms() {
  mainContent.classList.add('fade-out')
  setTimeout(() => {
    mainContent.innerHTML = ''
    mainContent.appendChild(RoomsContainer())
    mainContent.classList.remove('fade-out')
  }, 300);
  roomsBtn.classList.add('active');
  snakesBtn.classList.remove('active');
}

function showSnakes() {
  mainContent.classList.add('fade-out')
  setTimeout(() => {
    mainContent.innerHTML = ''
    mainContent.appendChild(KitchenView())
    mainContent.classList.remove('fade-out')
  }, 300);
  snakesBtn.classList.add('active');
  roomsBtn.classList.remove('active');
}

roomsBtn.addEventListener('click', (e) => {
  e.preventDefault()
  showRooms()
})

snakesBtn.addEventListener('click', (e) => {
  e.preventDefault()
  showSnakes()
})

showRooms()
