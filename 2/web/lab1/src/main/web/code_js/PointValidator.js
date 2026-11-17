class PointValidator {
    
    // валидация y
    static validateY(raw_text) {
        const text = raw_text.trim()

        if (text === '') {
            return { result: false, msg: 'Введите y' };
        }

        if (!/^-?\d+([.,]\d+)?$/.test(text)) {
            return { result: false, msg: 'y должен быть десятичным числом' };
        }

        const y = Number(text.replace("," , "."));

        if (y < -5 || y > 5) {
            return { result: false, msg: 'y должен быть в диапазоне [-5; 5]' };
        }

        return { result: true, value: y };
    }

    // валидация x
    static validateX(raw_x) {
        
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
    static validateR(raw_r) {
        
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

}
