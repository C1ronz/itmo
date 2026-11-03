var c = document.getElementById("graph1");
var ctx = c.getContext("2d");

const W = c.width;
const H = c.height;

const stepS = 4;
const step = H/5;

const startX = W/2;
const startY = H/2;

const font = '11px Arial';
ctx.font = font;

ctx.strokeStyle = '#000';
ctx.lineWidth = 1;

// закрашенная область

ctx.fillStyle = '#3399FF';

ctx.beginPath();
ctx.moveTo(startX - 2*step, startY);
ctx.lineTo(startX, startY - step);
ctx.lineTo(startX, startY);
ctx.closePath();
ctx.fill();

ctx.fillRect(startX, startY, 2*step, step );

ctx.beginPath();
ctx.moveTo(startX, startY)
ctx.arc(startX, startY, 2*step, -Math.PI/2, 0, false);
ctx.closePath();
ctx.fill();


ctx.strokeStyle = '#000';
ctx.fillStyle = '#000'
ctx.lineWidth = 1;


// ось x
ctx.beginPath();
ctx.moveTo(0, startY);
ctx.lineTo(W, startY);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(W, startY);
ctx.lineTo(W - 7, startY - 5);
ctx.lineTo(W - 7, startY + 5);
ctx.closePath();
ctx.fill();

ctx.fillText('x', W - 5, startY - 10);

// ось y
ctx.beginPath();
ctx.moveTo(startX, H);
ctx.lineTo(startX, 0);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(startX, 0);
ctx.lineTo(startX - 5, 7);
ctx.lineTo(startX + 5, 7);
ctx.closePath();
ctx.fill();

ctx.fillText('y', startX + 10, 5);



ctx.beginPath();
ctx.moveTo(startX + stepS, startY + step);
ctx.lineTo(startX - stepS, startY + step);
ctx.stroke();
ctx.fillText('-R/2', startX + stepS + 5, startY + step);

ctx.beginPath();
ctx.moveTo(startX + stepS, startY + 2*step);
ctx.lineTo(startX - stepS, startY + 2*step);
ctx.stroke();
ctx.fillText('-R', startX + stepS + 5, startY + 2*step);

ctx.beginPath();
ctx.moveTo(startX + stepS, startY - step);
ctx.lineTo(startX - stepS, startY - step);
ctx.stroke();
ctx.fillText('R/2', startX + stepS + 5, startY - step);

ctx.beginPath();
ctx.moveTo(startX + stepS, startY - 2*step);
ctx.lineTo(startX - stepS, startY - 2*step);
ctx.stroke();
ctx.fillText('R', startX + stepS + 5, startY - 2*step);

ctx.beginPath();
ctx.moveTo(startX + step, startY + stepS);
ctx.lineTo(startX + step, startY - stepS);
ctx.stroke();
ctx.fillText('R/2', startX + step - 5, startY + stepS - 10);

ctx.beginPath();
ctx.moveTo(startX + 2*step, startY + stepS);
ctx.lineTo(startX + 2*step, startY - stepS);
ctx.stroke();
ctx.fillText('R', startX + 2*step - 5, startY + stepS - 10);

ctx.beginPath();
ctx.moveTo(startX - step, startY + stepS);
ctx.lineTo(startX - step, startY - stepS);
ctx.stroke();
ctx.fillText('-R/2', startX - step - 5, startY + stepS - 10);

ctx.beginPath();
ctx.moveTo(startX - 2*step, startY + stepS);
ctx.lineTo(startX - 2*step, startY - stepS);
ctx.stroke();
ctx.fillText('R', startX - 2*step - 5, startY + stepS - 10);
