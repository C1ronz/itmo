class PointForm {
    constructor({ form, xFieldset, yInput, rFieldset, xErr, yErr, rErr, onSubmit, onRChange }) {
        this.form = form;
        this.xFieldset = xFieldset;
        this.yInput = yInput;
        this.rFieldset = rFieldset;
        this.errors = { x: xErr, y: yErr, r: rErr };
        this.onSubmit = onSubmit;
        this.onRChange = onRChange;

        this.selectedX = null;
        this.selectedR = null;

        this.bindX();
        this.bindR();
        this.form.addEventListener('submit', e => this.handleSubmit(e));
    }

    bindX() {
        this.xFieldset.querySelectorAll('input[type="button"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.xFieldset.querySelectorAll('input[type="button"]')
                    .forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedX = parseFloat(btn.value);
            });
        });
    }

    bindR() {
        this.rFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const arr = [];
            this.rFieldset.querySelectorAll('input[type="checkbox"]').forEach(c => {
                if (c.checked) arr.push(parseFloat(c.value));
            });
            this.selectedR = arr.length === 0 ? null : arr;
            this.onRChange(this.selectedR);
        });
    });
    }

    setError(field, msg) {
        const el = this.errors[field];
        el.textContent = msg;
        el.classList.add('visible');
    }

    removeErrors() {
        this.form.querySelectorAll('.error_field').forEach(ef => {
            ef.textContent = '';
            ef.classList.remove('visible');
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.removeErrors();

        let errFlag = false;

        if (this.selectedR === null || this.selectedR.length === 0) {
            this.setError('r', 'Выберите хотя бы одно значение r');
            errFlag = true;
        }

        const xCheck = PointValidator.validateX(this.selectedX);
        if (!xCheck.result) {
            this.setError('x', xCheck.msg);
            errFlag = true;
        }

        const yCheck = PointValidator.validateY(this.yInput.value);
        if (!yCheck.result) {
            this.setError('y', yCheck.msg);
            errFlag = true;
        }

        if (this.selectedR) {
            for (const r of this.selectedR) {
                const rCheck = PointValidator.validateR(r);
                if (!rCheck.result) {
                    this._setError('r', rCheck.msg);
                    errFlag = true;
                }
            }
        }

        if (errFlag) return;

        this.onSubmit({
            x: xCheck.value,
            y: yCheck.value,
            rArray: this.selectedR,
        });
    }
}