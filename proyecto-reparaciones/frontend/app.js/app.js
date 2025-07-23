document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ticket-form');
    const tableBody = document.querySelector('#tickets-table tbody');
    const ticketIdInput = document.getElementById('ticket-id');
    const API_URL = 'http://localhost:3000/tickets';

    const fetchTickets = async () => {
        try {
            const response = await fetch(API_URL);
            const tickets = await response.json();
            tableBody.innerHTML = '';
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.cliente}</td>
                    <td>${ticket.equipo}</td>
                    <td>${ticket.problema}</td>
                    <td>${ticket.estado}</td>
                    <td>
                        <button class="btn-editar" data-id="${ticket.id}" data-cliente="${ticket.cliente}" data-equipo="${ticket.equipo}" data-problema="${ticket.problema}" data-estado="${ticket.estado}">Editar</button>
                        <button class="btn-borrar" data-id="${ticket.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar tickets:", error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ticketData = {
            cliente: document.getElementById('cliente').value,
            equipo: document.getElementById('equipo').value,
            problema: document.getElementById('problema').value,
            estado: document.getElementById('estado').value,
        };
        const id = ticketIdInput.value;
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            });
            form.reset();
            ticketIdInput.value = '';
            await fetchTickets();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    });

    tableBody.addEventListener('click', async (e) => {
        if (e.target.matches('.btn-editar')) {
            const btn = e.target;
            ticketIdInput.value = btn.dataset.id;
            document.getElementById('cliente').value = btn.dataset.cliente;
            document.getElementById('equipo').value = btn.dataset.equipo;
            document.getElementById('problema').value = btn.dataset.problema;
            document.getElementById('estado').value = btn.dataset.estado;
        }
        if (e.target.matches('.btn-borrar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Seguro que querés boletear este ticket, chango?')) {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                await fetchTickets();
            }
        }
    });

    fetchTickets();
});