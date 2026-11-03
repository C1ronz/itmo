const form = document.getElementById('x_form');
const xFieldset = document.getElementById('x_select');
const yInput = document.getElementById('y');
const rFieldset = document.getElementById('r_form');
const resultTable = document.getElementById('result_table');
const clearBtn = document.querySelector('button[type="button"]');

let selectedX = null;   
let selectedR = null;  

// обработка выбора x
xFieldset.querySelectorAll('input[type="button"]').forEach(bn => {
    bn.addEventListener('click', () => {
        xFieldset.querySelectorAll('input[type="button"]')
            .forEach(b => b.classList.remove('selected'));
        bn.classList.add('selected');
        selectedX = parseFloat(bn.value);
    });
});


// обработка выбора r
rFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
        if (cb.checked) {
            rFieldset.querySelectorAll('input[type="checkbox"]').forEach(other => {
                if (other !== cb) other.checked = false;
            });
            selectedR = parseFloat(cb.value);
        } else {
            selectedR = null;
        }
    });
});

// валидация y
function validateY(raw_text) {
    raw_text = raw_text.trim()

    if (raw_text === '') {
        return { result: false, msg: 'Введите y' };
    }

    const y = Number(raw_text);

    if (Number.isNaN(y)) {
        return { result: false, msg: 'y должен быть числом' };
    }

    if (y < -5 || y > 5) {
        return { result: false, msg: 'y должен быть в диапазоне [-5; 5]' };
    }

    return { result: true, value: y };
}

// проверка попадания в область
function isHit(x, y, r) {          
    return (x * x + y * y) <= (r * r);
}

// обработка для вывода дробных y
function formatNumber(n) {
    return Number.isInteger(n) ? n.toString() : n.toFixed(3);
}

function formatElapsed(ms) {
    return `${ms.toFixed(2)} мс`;
}

// сохранение точки в LocalStorage
function savePointToStorage(x, y, r, result, elapsed, timeStamp) {
    let history = JSON.parse(localStorage.getItem('lab1_history')) || [];
    history.push({ x, y, r, result, elapsed, time: timeStamp });
    localStorage.setItem('lab1_history', JSON.stringify(history));
}

// загрузка всех точек из LocalStorage на страницу
function loadHistoryFromStorage() {
    const history = JSON.parse(localStorage.getItem('lab1_history')) || [];
    
    for (let i = 0; i < history.length; i++) {
        const p = history[i];
        addResultRow(p.x, p.y, p.r, p.result, p.elapsed, p.time, true);
    }
}

// добавление строк в таблицу
function addResultRow(x, y, r, result, elapsed, savedTimeStamp = null, isFromStorage = false) {
    const tr  = document.createElement('tr');

    const timeStamp = savedTimeStamp !== null ? savedTimeStamp : Date.now();
    const timeStr = new Date(timeStamp).toLocaleString('ru-RU');

    const cells = [
        formatNumber(x),
        formatNumber(y),
        formatNumber(r),
        timeStr,
        formatElapsed(elapsed),
        result ? 'Попадание' : 'Промах'
    ];

    cells.forEach((text) => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
    });

    resultTable.insertBefore(tr, resultTable.rows[1] || null);

    if (!isFromStorage) {
        savePointToStorage(x, y, r, result, elapsed, timeStamp);
    }
}

// отчистка таблицы
clearBtn.addEventListener('click', () => {
    while (resultTable.rows.length > 1) {
        resultTable.deleteRow(1);
    }

    localStorage.removeItem('lab1_history');
});


// обработка отправки формы
form.addEventListener('submit', (e) => {
    const t0 = performance.now();

    e.preventDefault();

    if (selectedX === null) {
        alert('Выберите x');
        return;
    }

    if (selectedR === null) {
        alert('Выберите R');
        return;
    }

    const yCheck = validateY(yInput.value);
    if (!yCheck.result) {
        alert(yCheck.msg);
        return;
    }

    const x = selectedX;
    const y = yCheck.value;
    const r = selectedR;


    const result = isHit(x, y, r);
    const elapsed = performance.now() - t0;
    
    addResultRow(x, y, r, result, elapsed);

});

// Загружаем историю, как только страница открылась
loadHistoryFromStorage();

