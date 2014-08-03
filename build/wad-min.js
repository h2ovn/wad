/*! wad 2014-08-02 */
!function(a){var b="recorderWorker.js",c=function(a,c){var d=c||{},e=d.bufferLen||4096;this.context=a.context,this.node=(this.context.createScriptProcessor||this.context.createJavaScriptNode).call(this.context,e,2,2);var f=new Worker(d.workerPath||b);f.postMessage({command:"init",config:{sampleRate:this.context.sampleRate}});var g,h=!1;this.node.onaudioprocess=function(a){h&&f.postMessage({command:"record",buffer:[a.inputBuffer.getChannelData(0),a.inputBuffer.getChannelData(1)]})},this.configure=function(a){for(var b in a)a.hasOwnProperty(b)&&(d[b]=a[b])},this.record=function(){h=!0},this.stop=function(){h=!1},this.clear=function(){f.postMessage({command:"clear"})},this.getBuffer=function(a){g=a||d.callback,f.postMessage({command:"getBuffer"})},this.exportWAV=function(a,b){if(g=a||d.callback,b=b||d.type||"audio/wav",!g)throw new Error("Callback not set");f.postMessage({command:"exportWAV",type:b})},f.onmessage=function(a){var b=a.data;g(b)},a.connect(this.node),this.node.connect(this.context.destination)};c.forceDownload=function(b,c){var d=(a.URL||a.webkitURL).createObjectURL(b),e=a.document.createElement("a");e.href=d,e.download=c||"output.wav";var f=document.createEvent("Event");f.initEvent("click",!0,!0),e.dispatchEvent(f)},a.Recorder=c}(window);var audioContext=window.AudioContext||window.webkitAudioContext,context=new audioContext;getUserMedia=navigator.mozGetUserMedia||navigator.webkitGetUserMedia||navigator.getUserMedia,getUserMedia?getUserMedia=getUserMedia.bind(navigator):console.log("get user media is not supported");var Wad=function(){var a=function(){Math.seed=6,Math.seededRandom=function(a,b){a=a||1,b=b||0,Math.seed=(9301*Math.seed+49297)%233280;var c=Math.seed/233280;return b+c*(a-b)};for(var a=2*context.sampleRate,b=context.createBuffer(1,a,context.sampleRate),c=b.getChannelData(0),d=0;a>d;d++)c[d]=2*Math.seededRandom()-1;return b}(),b=function(a){return"[object Array]"===Object.prototype.toString.call(a)},c=function(a,b){a.env={attack:b.env?b.env.attack||0:0,decay:b.env?b.env.decay||0:0,sustain:b.env?b.env.sustain||1:1,hold:b.env?b.env.hold||4:4,release:b.env?b.env.release||0:0},a.defaultEnv={attack:b.env?b.env.attack||0:0,decay:b.env?b.env.decay||0:0,sustain:b.env?b.env.sustain||1:1,hold:b.env?b.env.hold||4:4,release:b.env?b.env.release||0:0}},d=function(a,c){c.filter&&(b(c.filter)?c.filter.forEach(function(b){d(a,{filter:b})}):(c.filter=[c.filter],a.filter=c.filter))},e=function(a,b){var c=new XMLHttpRequest;c.open("GET",a.source,!0),c.responseType="arraybuffer",a.playable--,c.onload=function(){context.decodeAudioData(c.response,function(c){a.decodedBuffer=c,b&&b(),a.playable++,a.playOnLoad&&a.play(a.playOnLoadArg)})},c.send()},f=function(a,b){b.vibrato&&(a.vibrato={shape:b.vibrato.shape||"sine",speed:b.vibrato.speed||1,magnitude:b.vibrato.magnitude||5,attack:b.vibrato.attack||0})},g=function(a,b){b.tremolo&&(a.tremolo={shape:b.tremolo.shape||"sine",speed:b.tremolo.speed||1,magnitude:b.tremolo.magnitude||5,attack:b.tremolo.attack||1})},h=function(a,b){if(b.reverb){a.reverb={wet:b.reverb.wet||1};var c=b.reverb.impulse||k.defaultImpulse,d=new XMLHttpRequest;d.open("GET",c,!0),d.responseType="arraybuffer",a.playable--,d.onload=function(){context.decodeAudioData(d.response,function(c){a.reverb.buffer=c,a.playable++,a.playOnLoad&&a.play(a.playOnLoadArg),a instanceof k.Poly&&a.setUp(b)})},d.send()}},i=function(a,b){a.panning="panning"in b?"number"==typeof b.panning?{location:[b.panning,0,0]}:{location:[b.panning[0],b.panning[1],b.panning[2]]}:{location:[0,0,0]}},j=function(a,b){getUserMedia({audio:!0,video:!1},function(c){a.nodes=[],a.mediaStreamSource=context.createMediaStreamSource(c),a.gain=context.createGain(),a.gain.gain.value=a.volume,a.nodes.push(a.mediaStreamSource),a.nodes.push(a.gain),a.filter&&q(a,b),a.reverb&&(a.reverb.node=context.createConvolver(),a.reverb.node.buffer=a.reverb.buffer,a.reverb.gain=context.createGain(),a.reverb.gain.gain.value=a.reverb.wet,a.nodes.push(a.reverb.node),a.nodes.push(a.reverb.gain)),a.panning&&(a.panning.node=context.createPanner(),a.panning.node.setPosition(a.panning.location[0],a.panning.location[1],a.panning.location[2]),a.nodes.push(a.panning.node))},function(a){console.log("Error setting up microphone input: ",a)})},k=function(b){if(this.source=b.source,this.destination=b.destination||context.destination,this.volume=b.volume||1,this.defaultVolume=this.volume,this.playable=1,this.pitch=k.pitches[b.pitch]||b.pitch||440,this.globalReverb=b.globalReverb||!1,this.gain=[],c(this,b),d(this,b),f(this,b),g(this,b),h(this,b),this.constructExternalFx(b,context),i(this,b),"noise"===this.source)this.decodedBuffer=a;else if("mic"===this.source)j(this,b);else if("object"==typeof this.source){var l=context.createBuffer(2,this.source[0].length,context.sampleRate);l.getChannelData(0).set(this.source[0]),l.getChannelData(1).set(this.source[1]),this.decodedBuffer=l}else this.source in{sine:0,sawtooth:0,square:0,triangle:0}||e(this,b.callback)},l=function(a,b){a.filter.forEach(function(a){a.node.frequency.linearRampToValueAtTime(a.frequency,context.currentTime+b.wait),a.node.frequency.linearRampToValueAtTime(a.env.frequency,context.currentTime+a.env.attack+b.wait)})},m=function(a,b){a.gain[0].gain.linearRampToValueAtTime(1e-4,context.currentTime+b.wait),a.gain[0].gain.linearRampToValueAtTime(a.volume,context.currentTime+a.env.attack+b.wait),a.gain[0].gain.linearRampToValueAtTime(a.volume*a.env.sustain,context.currentTime+a.env.attack+a.env.decay+b.wait),a.gain[0].gain.linearRampToValueAtTime(1e-4,context.currentTime+a.env.attack+a.env.decay+a.env.hold+a.env.release+b.wait),a.soundSource.start(context.currentTime+b.wait),a.soundSource.stop(context.currentTime+a.env.attack+a.env.decay+a.env.hold+a.env.release+b.wait)},n=function(a,b){for(var c=b&&b.destination||a.destination,d=1;d<a.nodes.length;d++)a.nodes[d-1].connect(a.nodes[d]),a.nodes[d]instanceof ConvolverNode&&a.nodes[d-1].connect(a.nodes[d+2]);a.nodes[a.nodes.length-1].connect(c),k.reverb&&a.globalReverb&&(a.nodes[a.nodes.length-1].connect(k.reverb.node),k.reverb.node.connect(k.reverb.gain),k.reverb.gain.connect(c))},o=function(a,b){a.soundSource=context.createOscillator(),a.soundSource.type=a.source,a.soundSource.frequency.value=b&&b.pitch?b.pitch in k.pitches?k.pitches[b.pitch]:b.pitch:a.pitch},p=function(a,b){b&&b.env?(a.env.attack=b.env.attack||a.defaultEnv.attack,a.env.decay=b.env.decay||a.defaultEnv.decay,a.env.sustain=b.env.sustain||a.defaultEnv.sustain,a.env.hold=b.env.hold||a.defaultEnv.hold,a.env.release=b.env.release||a.defaultEnv.release):a.env={attack:a.defaultEnv.attack,decay:a.defaultEnv.decay,sustain:a.defaultEnv.sustain,hold:a.defaultEnv.hold,release:a.defaultEnv.release}},q=function(a,b){a.filter.forEach(function(c,d){c.node=context.createBiquadFilter(),c.node.type=c.type,c.node.frequency.value=b.filter[d]?b.filter[d].frequency||c.frequency:c.frequency,c.node.Q.value=b.filter[d]?b.filter[d].q||c.q:c.q,(b.filter[d].env||a.filter[d].env)&&"mic"!==a.source&&(c.env={attack:b.filter[d].env&&b.filter[d].env.attack||a.filter[d].env.attack,frequency:b.filter[d].env&&b.filter[d].env.frequency||a.filter[d].env.frequency}),a.nodes.push(c.node)})},r=function(a,c){c&&c.filter&&a.filter?(b(c.filter)||(c.filter=[c.filter]),q(a,c)):a.filter&&q(a,a)},s=function(a){a.reverb.node=context.createConvolver(),a.reverb.node.buffer=a.reverb.buffer,a.reverb.gain=context.createGain(),a.reverb.gain.gain.value=a.reverb.wet,a.nodes.push(a.reverb.node),a.nodes.push(a.reverb.gain)},t=function(a,b){if(b&&b.panning||a.panning){if(a.panning.node=context.createPanner(),b&&b.panning)if("number"==typeof b.panning)var c=[b.panning,0,0];else var c=[b.panning[0],b.panning[1],b.panning[2]];else var c=[0,0,0];a.panning.node.setPosition(c[0],c[1],c[2]),a.nodes.push(a.panning.node)}},u=function(a){a.vibrato.wad=new k({source:a.vibrato.shape,pitch:a.vibrato.speed,volume:a.vibrato.magnitude,env:{attack:a.vibrato.attack},destination:a.soundSource.frequency}),a.vibrato.wad.play()},v=function(a){a.tremolo.wad=new k({source:a.tremolo.shape,pitch:a.tremolo.speed,volume:a.tremolo.magnitude,env:{attack:a.tremolo.attack},destination:a.gain[0].gain}),a.tremolo.wad.play()};k.prototype.constructExternalFx=function(){},k.prototype.setUpExternalFxOnPlay=function(){},k.prototype.play=function(a){if(this.playable<1)this.playOnLoad=!0,this.playOnLoadArg=a;else if("mic"===this.source)n(this,a);else{if(this.nodes=[],a&&!a.wait&&(a.wait=0),!a)var a={wait:0};this.volume=a&&a.volume?a.volume:this.defaultVolume,this.source in{sine:0,sawtooth:0,square:0,triangle:0}?o(this,a):(this.soundSource=context.createBufferSource(),this.soundSource.buffer=this.decodedBuffer,"noise"===this.source&&(this.soundSource.loop=!0)),this.nodes.push(this.soundSource),p(this,a),r(this,a),this.setUpExternalFxOnPlay(a,context),this.gain.unshift(context.createGain()),this.gain[0].label=a.label,this.nodes.push(this.gain[0]),this.reverb&&s(this,a),t(this,a),n(this,a),this.filter&&this.filter.env&&l(this,a),m(this,a),this.vibrato&&u(this,a),this.tremolo&&v(this,a)}return a.callback&&a.callback(this),this},k.prototype.setVolume=function(a){return this.defaultVolume=a,this.gain.length>0&&(this.gain[0].gain.value=a),this},k.prototype.setPanning=function(a){return"number"==typeof a?this.panning.node.setPosition(a,this.panning.location[1],this.panning.location[2]):this.panning.node.setPosition(a[0],a[1],a[2]),this},k.prototype.stop=function(a){if("mic"!==this.source){if(a)for(var b=0;b<this.gain.length;b++)this.gain[b].label===a&&(this.gain[b].gain.cancelScheduledValues(context.currentTime),this.gain[b].gain.setValueAtTime(this.gain[b].gain.value,context.currentTime),this.gain[b].gain.linearRampToValueAtTime(1e-4,context.currentTime+this.env.release));a||(this.gain[0].gain.cancelScheduledValues(context.currentTime),this.gain[0].gain.setValueAtTime(this.gain[0].gain.value,context.currentTime),this.gain[0].gain.linearRampToValueAtTime(1e-4,context.currentTime+this.env.release))}else this.mediaStreamSource.disconnect(0)},k.Poly=function(a){a||(a={}),this.isSetUp=!1,this.playable=1,this.setUp=function(a){if(this.wads=[],this.input=context.createAnalyser(),this.nodes=[this.input],this.destination=a.destination||context.destination,this.volume=a.volume||1,this.output=context.createGain(),this.output.gain.value=this.volume,"undefined"!=typeof Recorder){this.rec=new Recorder(this.output,a.recConfig),this.rec.recordings=[];var b=this,c=function(a){b.rec.recordings.unshift(new k({source:a,env:{hold:9001}}))};this.rec.createWad=function(){this.getBuffer(c)}}this.globalReverb=a.globalReverb||!1,d(this,a),this.filter&&q(this,a),this.reverb&&s(this,a),this.constructExternalFx(a,context),i(this,a),t(this,a),this.nodes.push(this.output),n(this,a),this.isSetUp=!0,a.callback&&a.callback(this)},a.reverb?h(this,a):this.setUp(a),this.setVolume=function(a){return this.isSetUp?this.output.gain.value=a:console.log("This PolyWad is not set up yet."),this},this.play=function(a){if(this.isSetUp)if(this.playable<1)this.playOnLoad=!0,this.playOnLoadArg=a;else{a&&a.volume&&(this.output.gain.value=a.volume,a.volume=void 0);for(var b=0;b<this.wads.length;b++)this.wads[b].play(a)}else console.log("This PolyWad is not set up yet.");return this},this.stop=function(a){if(this.isSetUp)for(var b=0;b<this.wads.length;b++)this.wads[b].stop(a)},this.add=function(a){return this.isSetUp?(a.destination=this.input,this.wads.push(a),a instanceof k.Poly&&(console.log("poly!"),a.output.disconnect(0),a.output.connect(this.input))):console.log("This PolyWad is not set up yet."),this},this.remove=function(a){if(this.isSetUp)for(var b=0;b<this.wads.length;b++)this.wads[b]===a&&(this.wads[b].destination=context.destination,this.wads.splice(b,1),a instanceof k.Poly&&(a.output.disconnect(0),a.output.connect(context.destination)));return this}},k.Poly.prototype.constructExternalFx=function(){},k.defaultImpulse="http://www.codecur.io/us/sendaudio/widehall.wav",k.setGlobalReverb=function(a){k.reverb={},k.reverb.node=context.createConvolver(),k.reverb.gain=context.createGain(),k.reverb.gain.gain.value=a.wet;var b=a.impulse||k.defaultImpulse,c=new XMLHttpRequest;c.open("GET",b,!0),c.responseType="arraybuffer",c.onload=function(){context.decodeAudioData(c.response,function(a){k.reverb.node.buffer=a})},c.send()},k.pitches={A0:27.5,"A#0":29.1352,Bb0:29.1352,B0:30.8677,C1:32.7032,"C#1":34.6478,Db1:34.6478,D1:36.7081,"D#1":38.8909,Eb1:38.8909,E1:41.2034,F1:43.6535,"F#1":46.2493,Gb1:46.2493,G1:48.9994,"G#1":51.9131,Ab1:51.9131,A1:55,"A#1":58.2705,Bb1:58.2705,B1:61.7354,C2:65.4064,"C#2":69.2957,Db2:69.2957,D2:73.4162,"D#2":77.7817,Eb2:77.7817,E2:82.4069,F2:87.3071,"F#2":92.4986,Gb2:92.4986,G2:97.9989,"G#2":103.826,Ab2:103.826,A2:110,"A#2":116.541,Bb2:116.541,B2:123.471,C3:130.813,"C#3":138.591,Db3:138.591,D3:146.832,"D#3":155.563,Eb3:155.563,E3:164.814,F3:174.614,"F#3":184.997,Gb3:184.997,G3:195.998,"G#3":207.652,Ab3:207.652,A3:220,"A#3":233.082,Bb3:233.082,B3:246.942,C4:261.626,"C#4":277.183,Db4:277.183,D4:293.665,"D#4":311.127,Eb4:311.127,E4:329.628,F4:349.228,"F#4":369.994,Gb4:369.994,G4:391.995,"G#4":415.305,Ab4:415.305,A4:440,"A#4":466.164,Bb4:466.164,B4:493.883,C5:523.251,"C#5":554.365,Db5:554.365,D5:587.33,"D#5":622.254,Eb5:622.254,E5:659.255,F5:698.456,"F#5":739.989,Gb5:739.989,G5:783.991,"G#5":830.609,Ab5:830.609,A5:880,"A#5":932.328,Bb5:932.328,B5:987.767,C6:1046.5,"C#6":1108.73,Db6:1108.73,D6:1174.66,"D#6":1244.51,Eb6:1244.51,E6:1318.51,F6:1396.91,"F#6":1479.98,Gb6:1479.98,G6:1567.98,"G#6":1661.22,Ab6:1661.22,A6:1760,"A#6":1864.66,Bb6:1864.66,B6:1975.53,C7:2093,"C#7":2217.46,Db7:2217.46,D7:2349.32,"D#7":2489.02,Eb7:2489.02,E7:2637.02,F7:2793.83,"F#7":2959.96,Gb7:2959.96,G7:3135.96,"G#7":3322.44,Ab7:3322.44,A7:3520,"A#7":3729.31,Bb7:3729.31,B7:3951.07,C8:4186.01},k.pitchesArray=["C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0","C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1","C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6","C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7","C8"],k.midiInstrument={play:function(){console.log("playing midi")},stop:function(){console.log("stopping midi")}},k.midiMaps=[],k.midiMaps[0]=function(a){console.log(a.receivedTime,a.data),144===a.data[0]?0===a.data[2]?(console.log("|| stopping note: ",k.pitchesArray[a.data[1]-12]),k.midiInstrument.stop(k.pitchesArray[a.data[1]-12])):a.data[2]>0&&(console.log("> playing note: ",k.pitchesArray[a.data[1]-12]),k.midiInstrument.play({pitch:k.pitchesArray[a.data[1]-12],label:k.pitchesArray[a.data[1]-12],callback:function(a){console.log(a.soundSource.frequency.value)}})):176===a.data[0]?console.log("controller"):224===a.data[0]&&console.log("pitch bend")};var w=null,x=function(a){w=a;var b=w.inputs();console.log(b);for(var c=0;c<b.length;c++)b[c].onmidimessage=k.midiMaps[c]},y=function(a){console.log("uh-oh! Something went wrong!  Error code: "+a.code)};if(navigator&&navigator.requestMIDIAccess)try{navigator.requestMIDIAccess().then(x,y)}catch(z){var A="There was an error on this page.\n\n";A+="Error description: "+z.message+"\n\n",A+="Click OK to continue.\n\n",console.log(A)}return k.presets={hiHatClosed:{source:"noise",env:{attack:.001,decay:.008,sustain:.2,hold:.03,release:.01},filter:{type:"highpass",frequency:400,q:1}},snare:{source:"noise",env:{attack:.001,decay:.01,sustain:.2,hold:.03,release:.02},filter:{type:"bandpass",frequency:300,q:.18}},hiHatOpen:{source:"noise",env:{attack:.001,decay:.008,sustain:.2,hold:.43,release:.01},filter:{type:"highpass",frequency:100,q:.2}},ghost:{source:"square",volume:.3,env:{attack:.01,decay:.002,sustain:.5,hold:2.5,release:.3},filter:{type:"lowpass",frequency:600,q:7,env:{attack:.7,frequency:1600}},vibrato:{attack:8,speed:8,magnitude:100}},piano:{source:"square",volume:1.4,env:{attack:.01,decay:.005,sustain:.2,hold:.015,release:.3},filter:{type:"lowpass",frequency:1200,q:8.5,env:{attack:.2,frequency:600}}}},k}();