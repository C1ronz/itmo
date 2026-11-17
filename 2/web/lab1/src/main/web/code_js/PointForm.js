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

        this._bindX();
        this._bindR();
        this.form.addEventListener('submit', e => this._handleSubmit(e));
    }

    _bindX() {
        this.xFieldset.querySelectorAll('input[type="button"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.xFieldset.querySelectorAll('input[type="button"]')
                    .forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedX = parseFloat(btn.value);
            });
        });
    }

    _bindR() {
        const update = () => {
            const arr = [];
            this.rFieldset.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (cb.checked) arr.push(parseFloat(cb.value));
            });
            this.selectedR = arr.length === 0 ? null : arr;
            this.onRChange(this.selectedR);
        };

        this.rFieldset.querySelectorAll('input[type="checkbox"]')
            .forEach(cb => cb.addEventListener('change', update));
    }

    _setError(field, msg) {
        const el = this.errors[field];
        el.textContent = msg;
        el.classList.add('visible');
    }

    _removeErrors() {
        this.form.querySelectorAll('.error_field').forEach(ef => {
            ef.textContent = '';
            ef.classList.remove('visible');
        });
    }

    _handleSubmit(e) {
        e.preventDefault();
        this._removeErrors();

        let errFlag = false;

        if (this.selectedR === null || this.selectedR.length === 0) {
            this._setError('r', 'Выберите хотя бы одно значение r');
            errFlag = true;
        }

        const xCheck = PointValidator.validateX(this.selectedX);
        if (!xCheck.result) {
            this._setError('x', xCheck.msg);
            errFlag = true;
        }

        const yCheck = PointValidator.validateY(this.yInput.value);
        if (!yCheck.result) {
            this._setError('y', yCheck.msg);
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