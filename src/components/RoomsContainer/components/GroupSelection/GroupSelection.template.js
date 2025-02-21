import { roomTypes } from '../../../../data/gameRooms'

export const getGroupSelectionTemplate = (room, isEditing = false) => `
    <div class="modal-content group-selection-content">
        <div class="modal-header">
            <h2>${isEditing ? 'Gestionar Grupo' : 'Registrar Grupo'} - Sala ${room.id}</h2>
            <button class="modal-close">×</button>
        </div>
        
        <div class="group-selection-layout">
            <!-- Panel izquierdo solo para snacks seleccionados -->
            <div class="selected-panel">
                <h3>Snacks Seleccionados</h3>
                <div class="selected-snacks-container" id="selectedSnacksList">
                    <p class="no-snacks-message">No hay snacks seleccionados</p>
                </div>
            </div>

            <!-- Panel derecho para datos del grupo -->
            <div class="group-panel">
                <div class="form-group">
                    <label for="groupSize">Número de personas:</label>
                    <div class="input-with-controls">
                        <button class="btn-circle decrease" id="decreaseSize">-</button>
                        <input type="number" min="1" max="4" value="1" id="groupSize" readonly>
                        <button class="btn-circle increase" id="increaseSize">+</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Snacks Iniciales</label>
                    <button type="button" class="btn btn-secondary" id="addSnacksBtn">
                        ${isEditing ? 'Modificar Snacks' : 'Agregar Snacks'} <span class="btn-icon">+</span>
                    </button>
                </div>

                <div class="totals-section">
                    <h3>Resumen</h3>
                    <div class="total-row">
                        <span>Total Ticket:</span>
                        <span class="total-value" id="ticketTotal">$0</span>
                    </div>
                    <div class="total-row">
                        <span>Total Snacks:</span>
                        <span class="total-value" id="snacksTotal">$0</span>
                    </div>
                    <div class="total-row final">
                        <span>Total:</span>
                        <span class="total-value" id="grandTotal">$0</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn ${isEditing ? 'btn-secondary' : 'btn-primary'}" id="cancelCheckin">
                        ${isEditing ? 'Guardar' : 'Cancelar'}
                    </button>
                    <button class="btn ${isEditing ? 'btn-primary' : 'btn-secondary'}" id="confirmCheckin">
                        ${isEditing ? 'Finalizar Grupo' : 'Confirmar Grupo'}
                    </button>
                </div>
            </div>
        </div>
    </div>
`