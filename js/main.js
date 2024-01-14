

function main() {

    const minFrq = 100;
    const maxFrq = 20000;
    var width = 1;
    var height = 1;

    var bufferLength = 0;


    var persistance = 3;
    const maxPersistance = 20;
    var fftX, fftY, fftW, fftH;
    var menuX;
    var yImpressum = 0;
    var waveX, waveY, waveW, waveH;
    var polX, polY, polW, polH;
    var resoX, resoY, resoW, resoH;

    var colorBg = "#101010";
    var col = 50;

    var fpos = 0.0;
    var freq = 1000.0;

    const fftSize = 8192;

    var frameCount = 0;
    var enComp;

    var fftData = null;
    var fftSlowData = null;
    var timeData = null;

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function drawFFT(sx, sy, w, h) {
        var wStep, bStep;
        if (w < 1 || h < 1)
            return;
        canvas.drawWindow(sx, sy, w, h, 'yellow', colorBg);
        //				context.beginPath();
        //				context.fillStyle = colorBg;

        if (fftSlowData == null)
            return;

        let usedBufLen = fftSlowData.length / 2;
        if (w < usedBufLen) {
            bStep = usedBufLen / w;
            wStep = 1;
        } else {
            bStep = 1;
            wStep = w / usedBufLen;
        }
        //console.log("Step = " + step + " Len = " + bufferLength);

        for (var i = 0, p = 0; p < usedBufLen && i < w; i += wStep, p += bStep) {
            const y = ((h - (fftSlowData[~~p] / 50) * h) / 4);
            //if (i == 0)
            //context.moveTo(sx + i, y - 2);
            //else
            //context.lineTo(sx + i, y);
            canvas.drawLine(sx + i, y - 2, sx + i, y, 'orange')
        }
    }

    function drawWave(sx, sy, w, h) {
        var wStep, bStep;
        if (w < 1 || h < 1)
            return;

        canvas.drawWindow(sx, sy, w, h, 'yellow', colorBg);
        canvas.drawLine(sx, sy + h / 2, sx + w, sy + h / 2, 'gray');

        if (timeData == null)
            return;

        let len = timeData.length;

        if (w < len) {
            bStep = len / w;
            wStep = 1;
        } else {
            bStep = 1;
            wStep = w / len;
        }

        for (var i = 0, p = 0; p < len && i < w; i += wStep, p += bStep) {
            const y = sy + h / 2 + (timeData[~~p] * h) / 2;
            if (i == 0)
                canvas.beginLine(sx + i, y - 2, 'orange');
            //beginLine(sx + i, y - 2, 'orange');
            else
                //extendLine(sx + i, y);
                canvas.extendLine(sx + i, y);
        }
        canvas.endLine();
    }

    function drawPolar(sx, sy, w, h) {
        var wStep, bStep;
        if (w < 1 || h < 1)
            return;
        const dim = (w < h ? w : h) / 2 - 30;
        const cx = sx + w / 2;
        const cy = sy + h / 2;
        //frame

        //variant 1
        //context.fillStyle = colorBg;
        //context.fillRect(sx, sy, w, h);

        canvas.dimRect(sx, sy, w, h, maxPersistance - persistance);
        canvas.drawRect(sx, sy, w, h, 'yellow');


        //polarraster
        let step = dim / 20;
        for (var i = 2 * step; i <= dim; i += step)
            canvas.drawCircle(cx, cy, i, 'rgb(40,40,40)');
        canvas.drawCircle(cx, cy, dim / 2, 'white');

        canvas.drawLine(cx, cy, cx, cy + dim, 'rgb(40,40,40)');
        canvas.drawLine(cx, cy, cx, cy - dim, 'rgb(40,40,40)');
        canvas.drawLine(cx, cy, cx + dim, cy, 'rgb(40,40,40)');
        canvas.drawLine(cx, cy, cx - dim, cy, 'rgb(40,40,40)');
        for (var i = 0; i < 2 * Math.PI; i += Math.PI / 50)
            canvas.drawLine(cx + Math.sin(i) * step, cy + Math.cos(i) * step, cx + Math.sin(i) * dim, cy + Math.cos(i) * dim, 'rgb(30,30,30)');
        for (var i = 0; i < 2 * Math.PI; i += Math.PI / 10)
            canvas.drawLine(cx + Math.sin(i) * step, cy + Math.cos(i) * step, cx + Math.sin(i) * dim, cy + Math.cos(i) * dim, 'rgb(40,40,40)');

        //daten

        if (timeData == null)
            return;

        let bc = 255;
        var color = 'rgb(' + bc / 1 + ',' + bc / 2 + ',' + bc / 3 + ')';

        let minVar = .01;
        let decVar = .1;
        let len = timeData.length;

        wstep = Math.PI * 2 / len;
        //wstep = Math.PI * 2 * freq / sampleRate / 5.0;
        for (var w = 0, p = 0; p < len && w < Math.PI * 2; w += wstep, p++) {

            sc = (dim / 2 + (timeData[p] * dim / 2));
            const x = cx + Math.sin(w) * sc;
            const y = cy - Math.cos(w) * sc;
            if (p == 0)
                canvas.beginLine(x, y, color);
            else
                canvas.extendLine(x, y);
        }

        canvas.endLine();

    }

    function drawReso(sx, sy, w, h) {
        var wStep, bStep;
        if (w < 1 || h < 1)
            return;
        //frame
        canvas.drawWindow(sx, sy, w, h, 'yellow', colorBg);

        //daten
        if (timeData == null)
            return

        let len = timeData.length;
        let rate = audio.sampleRate;
        for (var i = 0; i < len; i++) {
            const y = ~~((timeData[i] * .9) * h);
            const x = ~~((Math.sin(fpos) * .45 + .5) * w);
            fpos += 880.0 * Math.PI / rate;
            if (i == 0)
                canvas.beginLine(sx + x, sy + h / 2 + y, 'orange');
            else
                canvas.extendLine(sx + x, sy + h / 2 + y);
        }
        canvas.endLine();
    }

    function drawInfo(sx, sy, w, h) {
        canvas.drawWindow(sx, sy, w, h, 'yellow', colorBg);
        canvas.ctx2d.font = "20px sans-serif";
        canvas.ctx2d.fillStyle = '#2f4f2f';
        canvas.ctx2d.fillText("~~AUDIOPOLAR~~ (c) 2024 / Thomas Ahlendorf / thomasahlendorf_at_gmail.com", 200, yImpressum);
    }

    function drawMenu(sx, sy, w, h) {
        canvas.drawWindow(sx, sy, w, h, 'yellow', colorBg);
        let yp = 15;
        let ys = 20;
        canvas.ctx2d.font = "12px sans-serif";
        canvas.ctx2d.fillStyle = '#ffffff';
        canvas.ctx2d.fillText("[fFgGhH] Frequency: " + freq.toFixed(2) + ' Hz', 10, yp); yp += ys;
        //				canvas.ctx2d.fillText("[V  ] Verstärkung (an/aus): " + (amplify ? "an" : "aus"), 10, yp); yp += ys;
        //				if (amplify) {
        //					canvas.ctx2d.fillText("[v  ] Verstärkung (autom.): " + (autoAmplify ? "an" : "aus"), 10, yp); yp += ys;
        //					if (autoAmplify) {
        //						canvas.ctx2d.fillText("[aA ] Verstärkung (Wert): " + (1 / ampVal).toFixed(3), 10, yp); yp += ys;
        //					}
        //				}
        canvas.ctx2d.fillText("[Nn ] Persistence (+/-): " + persistance, 10, yp); yp += ys;
        canvas.ctx2d.fillText("[c ] Compressor (on/off): " + (enComp ? 'on' : 'off'), 10, yp); yp += ys;

    }

    function draw() {
        audio.sampleData();
        fftData = audio.getFFTData();
        fftSlowData = audio.getSlowFFTData();
        timeData = audio.getTimeDomainData();
        //				context.strokeStyle = 'hsl(' + col++ + ',100%,30%)';

        drawFFT(fftX, fftY, fftW, fftH);
        drawWave(waveX, waveY, waveW, waveH);
        drawPolar(polX, polY, polW, polH);
        drawReso(resoX, resoY, resoW, resoH);
        drawInfo(infoX, infoY, infoW, infoH);
        drawMenu(menuX, menuY, menuW, menuH);

    };





    function redraw(time) {
        requestAnimationFrame(redraw);
        time *= 0.001;  // convert time to seconds

        draw();
    }


    function getKeyCode(event) {
        var Tastencode = event.which || event.keyCode;
        switch (Tastencode) {
        }
    }


    function getKeyUpCode(event) {
        var Tastencode = event.which || event.keyCode;
        switch (Tastencode) {
        }
    }


    function handleKeyDown(e) {
        //var Tastencode = event.which || event.keyCode; //deprecated
        //var Tastencode = e.code;
        switch (e.key) {
            //					case "a":
            //						if (ampVal > .00001)
            //							ampVal /= 2;
            //						else
            //							ampVal = .00001;
            //						break;
            //					case "A":
            //						if (ampVal < 128)
            //							ampVal *= 2;
            //						else
            //							ampVal = 8;
            //						break;
            //					case "v":
            //						amplify = !amplify;
            //						break;
            //					case "V":
            //						autoAmplify = !autoAmplify;
            //						break;
            case "f":
                freq -= 100;
                if (freq < minFrq)
                    freq = minFrq;
                break;
            case "F":
                freq += 100;
                if (freq > maxFrq)
                    freq = maxFrq;
                break;
            case "g":
                freq -= 1;
                if (freq < minFrq)
                    freq = minFrq;
                break;
            case "G":
                freq += 1;
                if (freq > maxFrq)
                    freq = maxFrq;
                break;
            case "h":
                freq -= .01;
                if (freq < minFrq)
                    freq = minFrq;
                break;
            case "H":
                freq += .01;
                if (freq > maxFrq)
                    freq = maxFrq;
                break;


            case "N":
                persistance += 1;
                if (persistance > maxPersistance)
                    persistance = maxPersistance;
                break;
            case "n":
                persistance -= 1;
                if (persistance < 0)
                    persistance = 0;
                break;
            case "c":
                enComp = !audio.useCompressor;
                audio.enableCompressor(enComp);
                break;
        }
    }

    function resizeHandler() {
        //canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        //canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;;

        let canvas_width = window.innerWidth;// || document.documentElement.clientWidth || document.body.clientWidth;
        let canvas_height = window.innerHeight;// || document.documentElement.clientHeight || document.body.clientHeight;;
        //canvas_width = document.body.scrollWidth;
        //canvas_height = document.body.clientHeight;
        canvas.resize(canvas_width, canvas_height);
        //				tempCanvas.resize(canvas_width, canvas_height);
        width = canvas_width;
        height = canvas_height;
        console.log('Context size changed to ' + width + ' x ' + height);

        //context.fillStyle = colorBg;
        //context.fillRect(0, 0, width, height);
        console.log('Context size changed to ' + width + ' x ' + height);

        xWall1 = 1;
        xWall2 = 200;	//menu
        xWall4 = width - 2;
        xWall3 = ~~((xWall4 - xWall2) / 3) + xWall2;

        yWall1 = 1;
        yWall6 = height - 2;
        yWall5 = height - 30;
        yWall2 = ~~((yWall5 - yWall1) / 3);
        yWall3 = ~~((yWall5 - yWall1) / 3 * 2);
        yWall4 = ~~((yWall5 - yWall1));

        //menuX = xWall2;
        yImpressum = height - 10;

        fftX = xWall2;
        fftY = yWall1;
        fftW = xWall3 - xWall2;
        fftH = yWall2 - yWall1;

        waveX = xWall2;
        waveY = yWall2;
        waveW = xWall3 - xWall2;
        waveH = yWall3 - yWall2;

        resoX = xWall2;
        resoY = yWall3;
        resoW = xWall3 - xWall2;
        resoH = yWall4 - yWall3;

        polX = xWall3;
        polY = yWall1;
        polW = xWall4 - xWall3;
        polH = yWall5;

        menuX = xWall1;
        menuY = yWall1;
        menuW = xWall2 - xWall1;
        menuH = yWall6 - yWall1;

        infoX = xWall2;
        infoY = yWall5;
        infoW = xWall4 - xWall2;
        infoH = yWall6 - yWall5;
        //console.log('fftX= ' + fftX + ' fftY= ' + fftY + ' fftW ' + fftW + ' fftH=' + fftH);
    }



    //"Main"-Area

    cv = document.getElementById('canvas');
    var canvas = new Gfx(cv);
    //			cv = document.getElementById('canvas');
    //			tempCanvas = new Gfx(cv);

    window.addEventListener('resize', resizeHandler);

    var audio = new audioIf();
    audio.init(fftSize)

    //const input = document.querySelector("input");
    //input.addEventListener("keydown", handleKeyDown);
    //requestAnimationFrame(redraw);//first time
    document.onkeydown = handleKeyDown;

    resizeHandler();

    redraw();	//start rendering
}

