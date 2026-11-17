class App {
    constructor() {
        const store = new PointStore();

        this.renderer = new GraphRenderer(document.getElementById('graphs_container'));
        this.table = new ResultTable(document.getElementById('result_table'), store);

        this.form = new PointForm({
            form: document.getElementById('point_form'),
            xFieldset: document.getElementById('x_select'),
            yInput: document.getElementById('y'),
            rFieldset: document.getElementById('r_select'),
            xErr: document.getElementById('x_error_field'),
            yErr: document.getElementById('y_error_field'),
            rErr: document.getElementById('r_error_field'),
            onSubmit: data => this.handleSubmit(data),
            onRChange: rArray => this.handleRChange(rArray),
        });

        document.getElementById('clean_btn')
            .addEventListener('click', () => this.table.clear());

        this.table.loadFromStorage();
        this.renderer.render(this.form.selectedR);
    }

    handleRChange(rArray) {
        this.renderer.setPoints([]);
        this.renderer.render(rArray);
    }

    handleSubmit({ x, y, rArray }) {
        const points = [];

        for (const r of rArray) {
            points.push({ x, y, r });

            const t0 = performance.now();
            const result = HitTester.isHit(x, y, r);
            const elapsed = performance.now() - t0;

            this.table.addRow(x, y, r, result, elapsed);
        }

        this.renderer.setPoints(points);
        this.renderer.render(rArray);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
