
class Gfx {

    constructor(canvas) {
        this.canvas = canvas;
        if (!!window.CanvasRenderingContext2D) {
            this.ctx2d = this.canvas.getContext('2d');
            this.resize(1, 1);
            //context.clearRect(0, 0, canvas.width, canvas.height);

            console.log('CONTEXT 2D SUPPORTED');
        } else {
            console.log('CONTEXT 2D NOT SUPPORTED');
        }

    }

    init() {
    }

    resize(w, h) {

        this.canvas.width = w;
        this.canvas.height = h;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        //this.ctx2d.fillStyle = colorBg;
        //this.ctx2d.fillRect(0, 0, this.width, this.height);
        console.log('Class Context size changed to ' + this.width + ' x ' + this.height);
    }


    getWidth() { return this.width; }
    getHeight() { return this.height; }
    getContext2d() { return this.ctx2d; }

    /*Graphics primitives*/

    drawRect(x, y, w, h, c) {
        this.ctx2d.beginPath();
        this.ctx2d.strokeStyle = c;
        this.ctx2d.moveTo(x, y);
        this.ctx2d.strokeRect(x, y, w, h);
        this.ctx2d.stroke();
    }
    drawLine(x, y, x1, y1, c) {
        this.ctx2d.beginPath();
        this.ctx2d.strokeStyle = c;
        this.ctx2d.moveTo(x, y);
        this.ctx2d.lineTo(x1, y1);
        this.ctx2d.stroke();
    }
    beginLine(x, y, c) {
        this.ctx2d.beginPath();
        this.ctx2d.strokeStyle = c;
        this.ctx2d.moveTo(x, y);
    }
    extendLine(x, y) {
        this.ctx2d.lineTo(x, y);
    }
    endLine() {
        this.ctx2d.stroke();
    }


    drawCircle(x, y, r, c) {
        this.ctx2d.strokeStyle = c;
        this.ctx2d.moveTo(x + r, y);
        this.ctx2d.beginPath();
        this.ctx2d.arc(x, y, r, 0, Math.PI * 2);
        this.ctx2d.stroke();

    }

    fillRect(x, y, w, h, c) {
        this.ctx2d.fillStyle = c;
        this.ctx2d.fillRect(x, y, w, h);
    }

    drawWindow(x, y, w, h, f, b) {
        this.fillRect(x + 1, y + 1, w - 2, h - 2, b);
        this.drawRect(x, y, w, h, f);
    }

    drawImage(img, x, y) {
        this.ctx2d.drawImage(img, x, y);
    }

    dimRect(x, y, w, h, am) {
        let col = 'rgb(' + am + ',' + am + ',' + am + ')';
        this.ctx2d.globalCompositeOperation = "difference";
        this.fillRect(x, y, w, h, col);
        //canvas.fillRect(0,0,width,height,'#00000040');
        this.ctx2d.globalCompositeOperation = "source-over";
    }

    static rand(btm, top) {
        return Math.random() * (top - btm) + btm;
    }

    static randColorRgb(btm, top) {
        const r = rand(btm, top);
        const g = rand(btm, top);
        const b = rand(btm, top);
        //const rCol = 'rgb(${r},${g},${b})'
        const rCol = 'rgb(' + r + ',' + g + ',' + b + ')'
        return rCol;
    }

}


				//CONTEXT 2D
				//				if (!!window.CanvasRenderingContext2D) {
				//					context = canvas.getContext('2d');
				//					resizeContext();
				//					//context.clearRect(0, 0, canvas.width, canvas.height);
				//
				//					console.log('CONTEXT 2D SUPPORTED');
				//
				//				} else {
				//					console.log('CONTEXT 2D NOT SUPPORTED');
				//					return false;
				//				}
				//				tempCanvas = document.createElement('canvas');

				// //WebGL
				// var webgl = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
				//
				// for (var i = 0, length = webgl.length; i < length; i++) {
				//     try {
				//         context = canvas.getContext(webgl[i]);
				//         break;
				//     } catch(e) {}
				// }

				//if (context) {
				//	console.log('WEBGL SUPPORTED');
				//} else {
				//	console.log('WEBGL NOT SUPPORTED');
				//}

				//const observer = new ResizeObserver((entries) => {
				//	canvas.width = canvas.clientWidth;
				//	canvas.height = canvas.clientHeight;
				//	width = canvas.width;
				//	height = canvas.height;
				//	console.log('Context size changed to ' + width + ' x ' + height);
				//});

				//const observer = new ResizeObserver();
				//observer.observe(canvas)
