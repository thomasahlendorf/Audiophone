
class audioIf {

    audioContext = null;
    audioSource = null;
    audioAnalyser = null;
    audioSlowAnalyser = null;
    audioGain = null;
    audioFilter = null;
    audioCompressor = null;
    useCompressor = true;
    useGain = false;

    dataArray = null;
    dataMemoryArray = null;
    fftArray = null;
    fftSlowArray = null;

    amp = 0;
    medAmp = 0;
    ampVal = 1.0;
    amplify = false;
    autoAmplify = false;

    contructor() {
    }

    relink() {
        this.audioCompressor.disconnect();
        this.audioGain.disconnect();
        this.audioSource.disconnect();

        let node = this.audioSource;
        if (this.useGain) {
            node.connect(this.audioGain);
            node = this.audioGain;
        }
        if (this.useCompressor) {
            node.connect(this.audioCompressor);
            node = this.audioCompressor;
        }
        node.connect(this.audioAnalyser);
        node.connect(this.audioSlowAnalyser);
    }

    enableCompressor(en) {
        this.useCompressor = en;
        this.relink();
    }

    init(fftSize) {
        //let stream = null;
        if (navigator.mediaDevices) {
            console.log("getUserMedia supported.");
            console.log('get Audio access');

            //MediaDevices.getUserMedia = MediaDevices.getUserMedia || MediaDevices.webkitGetUserMedia;
            try {
                //stream =  navigator.mediaDevices.getUserMedia({ audio : true, video : false });

                navigator.mediaDevices.enumerateDevices()
                    .then((devices) => {
                        devices.forEach((device) => {
                            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                        });
                    });
                navigator.mediaDevices.getUserMedia({ audio: { kind: { ideal: 'stereomix' } }, video: false })
                //navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                    .then((stream) => {
                        //navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact: deviceId}}})
                        //.then((stream) => {
                        const tracks = stream.getTracks();

                        this.stream = stream;

                        /* use the stream */
                        console.log('Audio aktive = ' + stream);

                        this.audioContext = new AudioContext();
                        //audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        this.sampleRate = this.audioContext.sampleRate;
                        //myArrayBuffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);
                        //anotherArray = new Float32Array(frameCount);
                        //const source = audioCtx.createMediaElementSource(myMediaElement);

                        console.log('Sample Rate = ' + this.sampleRate);

                        //console.log('create MediaStreamSource ');
                        this.audioSource = this.audioContext.createMediaStreamSource(stream);

                        //console.log('create analyzer');
                        this.audioAnalyser = this.audioContext.createAnalyser();
                        this.audioAnalyser.fftSize = fftSize;
                        this.audioAnalyser.smoothingTimeConstant = 0.0;

                        this.audioSlowAnalyser = this.audioContext.createAnalyser();
                        this.audioSlowAnalyser.fftSize = fftSize;
                        //audioSlowAnalyser.smoothingTimeConstant = 0.0;
                        console.log('FFT Size = ' + fftSize);

                        this.bufferLength = this.audioAnalyser.frequencyBinCount;
                        console.log('Buffr Length = ' + this.bufferLength);

                        this.dataArray = new Float32Array(this.bufferLength);

                        this.fftArray = new Float32Array(this.bufferLength);
                        this.fftSlowArray = new Float32Array(this.bufferLength);
                        //dataArray = new Uint8Array(bufferLength);

                        this.audioGain = this.audioContext.createGain();
                        this.audioGain.gain.value = 1.00;

                        this.audioFilter = this.audioContext.createBiquadFilter();
                        this.audioFilter.type = "bandpass";
                        this.audioFilter.frequency.setValueAtTime(5000, this.audioContext.currentTime);
                        this.audioFilter.Q.setValueAtTime(.1, this.audioContext.currentTime);;

                        this.audioCompressor = this.audioContext.createDynamicsCompressor();
                        this.audioCompressor.threshold.setValueAtTime(-50, this.audioContext.currentTime);
                        this.audioCompressor.knee.setValueAtTime(40, this.audioContext.currentTime);
                        this.audioCompressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
                        this.audioCompressor.attack.setValueAtTime(0, this.audioContext.currentTime);
                        this.audioCompressor.release.setValueAtTime(0.55, this.audioContext.currentTime);

                        this.relink();

                        //audioGain.connect(audioFilter);
                        //audioFilter.connect(audioAnalyser);
                        //})
                    })

            } catch (err) {
                /* handle the error */
                //console.log('Audio Error');
                console.log(`The following gUM error occurred: ${err}`);
                return false;
            }
        } else {
            //console.log('No Audio Devices');
            console.log("getUserMedia not supported on your browser!");
            return false;
        }

        return true;
    };

    sampleData() {
        if (this.audioAnalyser) {
            this.audioAnalyser.getFloatTimeDomainData(this.dataArray);
            this.audioAnalyser.getFloatFrequencyData(this.fftArray);
        }
        if (this.audioSlowAnalyser)
            this.audioSlowAnalyser.getFloatFrequencyData(this.fftSlowArray);

        //its better to use a compressor
        if (this.autoAmplify) {
            for (var i = 0, sum = 0, minm = 0, maxm = 0; i < this.bufferLength; i++) {
                let v = this.dataArray[i];
                sum += v;
                if (v < minm)
                    minm = v;
                if (v > maxm)
                    maxm = v;
            }
            this.medAmp = sum / (bufferLength);
            this.amp = maxm - minm;
        } else
            this.amp = this.ampVal;
        if (this.amplify) {
            if (this.amp > 0.01)
                for (var i = 0; i < this.bufferLength; i++)
                    this.dataArray[i] = this.dataArray[i] / this.amp;
        }

    }

    getFFTData() {
        return this.fftArray;
    }
    getSlowFFTData() {
        return this.fftSlowArray;
    }
    getTimeDomainData() {
        return this.dataArray;
    }
    //const channel=0;
    //nowBuffering = myArrayBuffer.getChannelData(channel);
    //myArrayBuffer.copyFromChannel(anotherArray, 0, 0);
    //
    // for (var i = 0, length = audioData.length, sum = 0; i < length; i++) {
    //     sum += audioData[i];
    // }
    //volume = sum / (length * 256);
}



