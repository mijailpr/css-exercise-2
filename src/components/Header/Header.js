import './Header.css'

export function Header() {
    const header = document.createElement('header')
    header.className = 'header'

    header.innerHTML = `
        <div class="header-left">
            <h1>🎮 TanyPlay</h1>
        </div>
        <div class="header-center">
            <nav>
                <a class="nav-btn" href="#salas-de-juego">Salas de juego</a>
                <a class="nav-btn" href="#snakes">Snakes</a>
            </nav>
        </div>
        <div class="header-right">
        </div>
    `

    return header
}