import './SnackSelection.css'
import { getSnackSelectionTemplate } from './SnackSelection.template'
import { snacks } from '../../../../data/gameRooms'

export function SnackSelection({ initialSnacks = new Map(), onConfirm, onCancel }) {
    const container = document.createElement('div')
    container.className = 'snack-selection-modal'
    const selectedSnacks = new Map(initialSnacks)

    const handleConfirm = (e) => {
        e.preventDefault()
        e.stopPropagation()
        onConfirm(selectedSnacks)
    }

    const handleCancel = (e) => {
        e.preventDefault()
        e.stopPropagation()
        onCancel()
    }

    const render = () => {
        container.innerHTML = getSnackSelectionTemplate(snacks, selectedSnacks)

        // Setup event listeners
        container.querySelector('.close-btn').addEventListener('click', handleCancel)
        container.querySelector('#cancelSnacks').addEventListener('click', handleCancel)
        container.querySelector('#confirmSnacks').addEventListener('click', handleConfirm)

        setupQuantityControls()
    }

    const setupEventListeners = () => {
        // Setup close button
        container.querySelector('.close-btn').addEventListener('click', handleCancel)

        // Setup cancel button
        container.querySelector('#cancelSnacks').addEventListener('click', handleCancel)

        // Setup confirm button
        container.querySelector('#confirmSnacks').addEventListener('click', handleConfirm)

        // Botones de navegación en móviles
        const header = container.querySelector('.modal-header')
        let lastScroll = 0

        // Ocultar/mostrar header al hacer scroll
        container.addEventListener('scroll', () => {
            const currentScroll = container.scrollTop
            if (currentScroll > lastScroll && currentScroll > 50) {
                header.style.transform = 'translateY(-100%)'
            } else {
                header.style.transform = 'translateY(0)'
            }
            lastScroll = currentScroll
        }, { passive: true })

        // Setup quantity controls
        setupQuantityControls()
    }

    const setupQuantityControls = () => {
        // Setup quantity controls solo para los snacks disponibles
        container.querySelectorAll('.snack-item').forEach(item => {
            const snackId = parseInt(item.dataset.id)
            const decreaseBtn = item.querySelector('.decrease')
            const increaseBtn = item.querySelector('.increase')
            const quantitySpan = item.querySelector('.quantity')

            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                const current = parseInt(quantitySpan.textContent)
                if (current > 0) {
                    const newQuantity = current - 1
                    quantitySpan.textContent = newQuantity
                    if (newQuantity === 0) {
                        selectedSnacks.delete(snackId)
                        item.classList.remove('selected')
                    } else {
                        selectedSnacks.set(snackId, {
                            ...snacks.find(s => s.id === snackId),
                            quantity: newQuantity
                        })
                    }
                    updateUI()
                }
            })

            increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                const current = parseInt(quantitySpan.textContent)
                const newQuantity = current + 1
                quantitySpan.textContent = newQuantity
                selectedSnacks.set(snackId, {
                    ...snacks.find(s => s.id === snackId),
                    quantity: newQuantity
                })
                item.classList.add('selected')
                updateUI()
            })
        })

        // Mejora para dispositivos táctiles
        container.querySelectorAll('.btn-control').forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)'
            }, { passive: true })

            btn.addEventListener('touchend', () => {
                btn.style.transform = ''
            }, { passive: true })
        })
    }

    function updateUI() {
        // Actualizar el panel de snacks seleccionados
        const selectedList = container.querySelector('.selected-snacks-list')
        if (selectedSnacks.size === 0) {
            selectedList.innerHTML = '<p class="no-snacks-message">No hay snacks seleccionados</p>'
        } else {
            selectedList.innerHTML = Array.from(selectedSnacks.values())
                .map(snack => `
                    <div class="selected-snack-item" data-id="${snack.id}">
                        <div class="selected-snack-info">
                            <span class="selected-snack-icon">${snack.image}</span>
                            <div class="selected-snack-details">
                                <span class="selected-snack-name">${snack.name}</span>
                                <span class="selected-snack-price">$${snack.price} × ${snack.quantity}</span>
                            </div>
                        </div>
                    </div>
                `).join('')
        }

        // Actualizar el total en el header
        const total = Array.from(selectedSnacks.values())
            .reduce((sum, snack) => sum + (snack.price * snack.quantity), 0)
        container.querySelector('.total-amount').textContent = `$${total}`
        container.querySelector('.cart-total').classList.toggle('hidden', selectedSnacks.size === 0)

        // Actualizar el estado de los snacks en la grilla
        container.querySelectorAll('.snack-item').forEach(item => {
            const snackId = parseInt(item.dataset.id)
            const quantitySpan = item.querySelector('.quantity')
            const snack = selectedSnacks.get(snackId)

            item.classList.toggle('selected', selectedSnacks.has(snackId))
            quantitySpan.textContent = snack ? snack.quantity : 0
        })

        // Actualizar el estado del botón confirmar
        const confirmBtn = container.querySelector('#confirmSnacks')
        confirmBtn.disabled = selectedSnacks.size === 0
    }

    render()
    return container
}