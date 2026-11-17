class HitTester {

    static EPS = 1e-9;

    static le(a, b) { return a <= b + HitTester.EPS; }   // a <= b с допуском
    static ge(a, b) { return a >= b - HitTester.EPS; }   // a >= b с допуском

    // проверка попадания в область
    static isHit(x, y, r) {          
        const circle = (x >= 0 && y >= 0 && HitTester.le(x*x + y*y, r*r));
        const rect = (x >= 0 && y <= 0 && x <= r && HitTester.ge(y, -r/2));
        const tri = (x <= 0 && y >= 0 && HitTester.le(y, 1/2 * x + r/2));
        return circle || rect || tri;
    }
}