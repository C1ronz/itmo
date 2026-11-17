const form = document.getElementById('point_form');
const xFieldset = document.getElementById('x_select');
const yInput = document.getElementById('y');
const rFieldset = document.getElementById('r_select');
const resultTable = document.getElementById('result_table');
const clearBtn = document.getElementById('clean_btn');

const xErr = document.getElementById('x_error_field')
const yErr = document.getElementById('y_error_field')
const rErr = document.getElementById('r_error_field')

let selectedX = null;   
let selectedR = null;  

const EPS = 1e-9;

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
function updateSelectedR() {
    const arr = [];
    rFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) arr.push(parseFloat(cb.value));
    });
    selectedR = arr.length === 0 ? null : arr;

    drawnPoints = [];
    renderGraphs(selectedR);
    
}

rFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateSelectedR);
});

// валидация y
function validateY(raw_text) {
    raw_text = raw_text.trim()

    if (raw_text === '') {
        return { result: false, msg: 'Введите y' };
    }

    if (!/^-?\d+([.,]\d+)?$/.test(raw_text)) {
        return { result: false, msg: 'y должен быть десятичным числом' };
    }

    const y = Number(raw_text.replace("," , "."));

    if (y < -5 || y > 5) {
        return { result: false, msg: 'y должен быть в диапазоне [-5; 5]' };
    }

    return { result: true, value: y };
}

// валидация x
function validateX(raw_x) {
    
    const arr = [-3,-2,-1,0,1,2,3,4,5]
    const x = Number(raw_x);

    if (Number.isNaN(x) || raw_x === null) {
        return { result: false, msg: 'x должен быть числом' };
    }

    if (!arr.includes(x)) {
        return { result: false, msg: 'x должен быть целым числом в диапазоне [-3; 5]' };
    }

    return { result: true, value: x };
}

// валидация r
function validateR(raw_r) {
    
    const arr = [1,2,3,4,5]
    const r = Number(raw_r);

    if (Number.isNaN(r)) {
        return { result: false, msg: 'r должен быть числом' };
    }

    if (!arr.includes(r)) {
        return { result: false, msg: 'r должен быть целым числом в диапазоне [1; 5]' };
    }

    return { result: true, value: r };
}

function le(a, b) { return a <= b + EPS; }   // a <= b с допуском
function ge(a, b) { return a >= b - EPS; }   // a >= b с допуском

// проверка попадания в область
function isHit(x, y, r) {          
    const circle = (x >= 0 && y >= 0 && le(x*x + y*y, r*r));
    const rect = (x >= 0 && y <= 0 && x <= r && ge(y, -r/2));
    const tri = (x <= 0 && y >= 0 && le(y, 1/2 * x + r/2));
    return circle || rect || tri;
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
        x,
        y,
        r,
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

function setError(error_field, msg){
    error_field.textContent = msg;
    error_field.classList.add('visible'); 
}

function removeErrors(){
    form.querySelectorAll('.error_field').forEach(ef => {
        ef.textContent = '';
        ef.classList.remove('visible'); 
    });
}


// обработка отправки формы
form.addEventListener('submit', (e) => {

    e.preventDefault();
    removeErrors();

    let errFlag = false;

    if (selectedR === null || selectedR.length === 0) {
        setError(rErr, 'Выберите хотя бы одно значение r');
        errFlag = true;
    }

    const xCheck = validateX(selectedX);
    if (!xCheck.result) {
        setError(xErr, xCheck.msg);
        errFlag = true;
    }

    const yCheck = validateY(yInput.value);
    if (!yCheck.result) {
        setError(yErr, yCheck.msg);
        errFlag = true;
    }
    
    if (selectedR) {
        for (const r of selectedR){
            const rCheck = validateR(r);
            if (!rCheck.result) {
                setError(rErr, rCheck.msg);
                errFlag = true;
            }
        }
    }

    if (errFlag){
        return;
    }

    const x = xCheck.value;
    const y = yCheck.value;
    const r_arr = selectedR;

    drawnPoints = [];

    for (const r of r_arr){
        drawnPoints.push({x,y,r})

        const t0 = performance.now();
        const result = isHit(x, y, r);
        const elapsed = performance.now() - t0;
        addResultRow(x, y, r, result, elapsed);
    }

    renderGraphs(selectedR)

});

// Загружаем историю, как только страница открылась
loadHistoryFromStorage();
renderGraphs(selectedR);

