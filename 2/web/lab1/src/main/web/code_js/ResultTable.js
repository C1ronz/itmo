class ResultTable {
    constructor(table, store) {
        this.table = table;
        this.store = store;
    }

    addRow(x, y, r, result, elapsed, savedTimestamp = null, fromStorage = false) {
        const tr = document.createElement('tr');
        const timestamp = savedTimestamp !== null ? savedTimestamp : Date.now();

        const cells = [
            x,
            y,
            r,
            new Date(timestamp).toLocaleString('ru-RU'),
            `${elapsed.toFixed(2)} мс`,
            result ? 'Попадание' : 'Промах',
        ];

        cells.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        });

        this.table.insertBefore(tr, this.table.rows[1] || null);

        if (!fromStorage) {
            this.store.add({ x, y, r, result, elapsed, time: timestamp });
        }
    }

    loadFromStorage() {
        this.store.load().forEach(p =>
            this.addRow(p.x, p.y, p.r, p.result, p.elapsed, p.time, true)
        );
    }

    clear() {
        while (this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
        this.store.clear();
    }
}