class GraphRenderer {
    constructor(container) {
        this.container = container;
        this.points = [];
    }

    setPoints(points) {
        this.points = points;
    }
S
    render(r_arr) {
        this.container.innerHTML = '';
        (r_arr || []).forEach(r => {
            const wrapper = document.createElement('div');
            wrapper.className = 'graph_wrapper';

            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;

            wrapper.appendChild(canvas);
            this.container.appendChild(wrapper);

            this.drawGraph(canvas, r);
        });
    }

    drawGraph(canvas, r) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const cx = W / 2;
        const cy = H / 2;

        const padding = 24;
        const R = Math.min(W, H) / 2 - padding;
        const step = R / 2;

        ctx.clearRect(0, 0, W, H);
        ctx.lineWidth = 1;

        // ---------- область ----------
        ctx.fillStyle = '#3399FF';

        // треугольник
        ctx.beginPath();
        ctx.moveTo(cx - R, cy);
        ctx.lineTo(cx, cy - step);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();

        // прямоугольник
        ctx.fillRect(cx, cy, R, step);

        // круг
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, -Math.PI / 2, 0, false);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.font = '11px Arial';

        // ось X
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(W, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W, cy);
        ctx.lineTo(W - 7, cy - 5);
        ctx.lineTo(W - 7, cy + 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillText('x', W - 12, cy - 10);

        // ось Y
        ctx.beginPath();
        ctx.moveTo(cx, H);
        ctx.lineTo(cx, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx - 5, 7);
        ctx.lineTo(cx + 5, 7);
        ctx.closePath();
        ctx.fill();
        ctx.fillText('y', cx + 8, 12);

        // ---------- деления ----------
        const tick = 4;
        const label = v => Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let k = -2; k <= 2; k++) {
            if (k === 0) continue;
            const x = cx + k * step;
            ctx.beginPath();
            ctx.moveTo(x, cy - tick);
            ctx.lineTo(x, cy + tick);
            ctx.stroke();
            ctx.fillText(label(k * r / 2), x, cy + tick + 2);
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let k = -2; k <= 2; k++) {
            if (k === 0) continue;
            const y = cy - k * step;
            ctx.beginPath();
            ctx.moveTo(cx - tick, y);
            ctx.lineTo(cx + tick, y);
            ctx.stroke();
            ctx.fillText(label(k * r / 2), cx - tick - 2, y);
        }

        // подпись R
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '13px Arial';
        ctx.fillText(`R = ${r}`, 6, 6);

        // ---------- точки ----------
        for (const p of this.points) {
            if (p.r === r) {
                this.drawPoint(ctx, cx, cy, R, r, p.x, p.y);
            }
        }
    }

    drawPoint(ctx, cx, cy, R, r, x, y) {
        const px = cx + (x / r) * R;
        const py = cy - (y / r) * R;

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}