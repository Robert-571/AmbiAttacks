import * as a1lib from "@alt1/base";
import ChatBoxReader, * as chatbox from "@alt1/chatbox";
import {strcomparescore} from "./strcompare";
import {Event} from "./event";
import "./css/style.css"

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

//images to use on the output table
var images = {
	fire : require("./assets/fire.png"),
	stun : require("./assets/stun.png"),
	sinister_fragment : require("./assets/sinister_fragment.png"),
	resonance : require("./assets/resonance.png"),
	deflect_magic : require("./assets/deflect_magic.png"),
}

//events that can appear on the output table
var events = {
	black_stone_flames :{
		text : "Black Stone Flames",
		img : images.fire

	},
	unstable_black_hole :{
		text : "Unstable Black Hole",
		img : images.stun
	},
	sinister_fragments :{
		text : "Sinister Fragments",
		img : images.sinister_fragment
	},
	sinister_fragments_end :{
		text : "Sinister Fragments end",
		img : images.sinister_fragment
	},
	pulse_of_erebus :{
		text : "Pulse of Erebus",
		img : images.resonance
	},
	shadow_onslaught :{
		text : "Shadow Onslaught",
		img : images.deflect_magic
	},
}

var schedule : Event[] = []

var title = document.getElementById("title");

//get elements from index.html and put in structure
var output_table = [
	{
		text : document.getElementById("slot0_text"),
		img : document.getElementById("slot0_img"),
		time : document.getElementById("slot0_time")
	},
	{
		text : document.getElementById("slot1_text"),
		img : document.getElementById("slot1_img"),
		time : document.getElementById("slot1_time")
	},
	{
		text : document.getElementById("slot2_text"),
		img : document.getElementById("slot2_img"),
		time : document.getElementById("slot2_time")
	}
]

//details of Ambassador's chatbox lines
var ambiChat = {
	prefixcolor: a1lib.mixColor(66, 132, 244),
	color: a1lib.mixColor(153, 255, 153),
	
	p1:"The Ambassador: So you come to witness this great moment.",

	fragments:{
		a:"The Ambassador: Your soul is but a candle in the darkness. I shall snuff it out!",
		b:"The Ambassador: BURN like the ants you are!",
		c:"The Ambassador: Have a taste...of his power.",
		d:"The Ambassador: BEHOLD HIS GLORY!"
	},

	p2:"The Ambassador: You should surrender...now.",
	p3:"The Ambassador: You! Pathetic worm, you could have been magnificent.",
	
	onslaught:"Fall now, and be forgotten.",

	end:"The Ambassador: *Cough* You think this is a victory? *cough*"
	
}

//details of other chatbox lines
var mechanicChat ={
	color: a1lib.mixColor(235, 47, 47),
	fragments: "fragments were reabsorbed!"
}

let c = new ChatBoxReader()
c.readargs = {
	colors: [
		ambiChat.prefixcolor,
		ambiChat.color,
		mechanicChat.color
	]
};

//states that the program can be in
enum state {
	start = "start",
	p1 = "p1",
	fragments = "fragments",
	p2 = "p2",
	p3 = "p3",
	end = "end"
}

var s : state

reset()

var reset_button = document.getElementById("reset_button");

reset_button.onclick = function(){
	reset()	
}

function reset() {
	console.log("Moving to state: start");
	s = state.start
	schedule = []
	reset_output()
	title.innerHTML = `Ready`
}

function reset_output(){
	for (var i in output_table){
		output_table[i].text.innerHTML = ""
		output_table[i].img.innerHTML = ""
		output_table[i].time.innerHTML = ""
	}
}

function capture() {
	var img = a1lib.captureHoldFullRs();
	processImg(img)
}

function processImg(img: a1lib.ImgRef ) {

	if (c.pos == null){
		c.find(img)
	}

	let t = c.read(img)

	if (t != []){

		switch (s) {
			case state.start: {
				check_start(t)
				break
			}
			case state.p1: {
				check_p1(t)
				break
			}
			case state.fragments: {
				check_fragments(t)
				break
			}
			case state.p2: {
				check_p2(t)
				break
			}
			case state.p3: {
				check_p3(t)
				break
			}
			case state.end: {
				break
			}
		}
	}
}

function check_start(c : chatbox.ChatLine[]){
	for (var i in c){
		var l = c[i].text
		l = remove_timestamp(l)
		if (strcomparescore(l,ambiChat.p1)>0.9){
			execute_p1()
			break
		}
	}
}

function execute_p1(){
	schedule = []
	var start = new Date().getTime();
	schedule.push(new Event(events.black_stone_flames,start+(16.8*1000)))
	schedule.push(new Event(events.unstable_black_hole,start+(30.6*1000)))
	schedule.push(new Event(events.black_stone_flames,start+(46.8*1000)))
	schedule.push(new Event(events.sinister_fragments,start+(60.6*1000)))
	console.log(schedule.toString())
	console.log("Moving to state: p1");
	title.innerHTML = "Phase 1"
	s = state.p1
}

function check_p1(c : chatbox.ChatLine[]){
	for (var i in c){
		var l = c[i].text
		l = remove_timestamp(l)
		if (strcomparescore(l,ambiChat.p2)>0.9){
			execute_p2()
			break
		}

		for (var j in ambiChat.fragments){

			var text = ambiChat.fragments[j]
			var score = strcomparescore(l,text)

			if (strcomparescore(l,text)>0.9){
				execute_fragments()
				break
			}

		}
	}
}

function execute_p2(){
	if (schedule.length>0 && schedule[schedule.length-1].get_content() == events.sinister_fragments){
		console.log("Removing sinsiter fragments from schedule");
		schedule.splice(schedule.length-1,1)
	}

	s = state.p2
	console.log("Moving to state: p2");
	title.innerHTML = "Phase 2"
}

function execute_fragments(){
	schedule = []
	var start = new Date().getTime();
	schedule.push(new Event(events.sinister_fragments_end,start+(54.6*1000)))

	s = state.fragments
	console.log("Moving to state: fragments");
	title.innerHTML = "Sinister Fragments"
}

function check_fragments(c : chatbox.ChatLine[]){
	for (var i in c){
		var l = c[i].text
		l = remove_timestamp(l)
		if (l.includes(mechanicChat.fragments)){
			var regex = /([0-6]) fragments were reabsorbed!/g
			var match = regex.exec(l)
			var n = 0
			if (match.length != null){
				n = parseInt(match[0])				
			}
			execute_fragments_end(n)
			break
		}
	}
}

function execute_fragments_end(n: number){
	console.log(`${n} pulses`);

	schedule = []
	var start = new Date().getTime();

	if (n >= 1){
		schedule.push(new Event(events.pulse_of_erebus,start+(6*1000)))
	}
	if (n >= 2){
		schedule.push(new Event(events.pulse_of_erebus,start+(13.8*1000)))
	}
	schedule.push(new Event(events.black_stone_flames,start+(16.2*1000)))
	if (n >= 3){
		schedule.push(new Event(events.pulse_of_erebus,start+(21.6*1000)))
	}
	if (n >= 4){
		schedule.push(new Event(events.pulse_of_erebus,start+(29.4*1000)))
	}
	schedule.push(new Event(events.unstable_black_hole,start+(30*1000)))
	if (n >= 5){
		schedule.push(new Event(events.pulse_of_erebus,start+(37.2*1000)))
	}
	if (n >= 6){
		schedule.push(new Event(events.pulse_of_erebus,start+(45*1000)))
	}
	schedule.push(new Event(events.black_stone_flames,start+(48*1000)))
	schedule.push(new Event(events.sinister_fragments,start+(61.8*1000)))

	s = state.p1
	console.log("Moving to state: p1");
	title.innerHTML = "Phase 1"
}

function check_p2(c : chatbox.ChatLine[]){
	for (var i in c){
		var l = c[i].text
		l = remove_timestamp(l)
		var now = new Date().getTime();
		if (strcomparescore(l,ambiChat.p3)>0.9){
			execute_p3()
			break
		}
	}
}

function execute_p3(){
	schedule = []
	var start = new Date().getTime();
	var first_shadow_onslaught_time = start+(54*1000)
	schedule.push(new Event(events.shadow_onslaught,first_shadow_onslaught_time))

	for (var i = 1; i<10; i++){
		schedule.push(new Event(events.shadow_onslaught,first_shadow_onslaught_time+(30.6*i*1000)))
	}
	
	s = state.p3
	console.log("Moving to state: p3");
	title.innerHTML = "Phase 3"
}

function check_p3(c : chatbox.ChatLine[]){
	for (var i in c){
		var l = c[i].text
		l = remove_timestamp(l)
		if (strcomparescore(l,ambiChat.end)>0.9){
			execute_end()
			break
		}
	}
}

function execute_end(){
	schedule = []
	console.log("Moving to state: end");
	s = state.end
	title.innerHTML = "Finished"
}

function remove_timestamp(s: string){
	var regex = /\[[0-9][0-9]:[0-9][0-9]:[0-9][0-9]\] (.*)/g
	var match = regex.exec(s)
	if 	(match != null && match.length>0){
		return match[1]
	}
	else {
		return s
	}
}

var linger_time = 500

function cull_schedule(){
	if (schedule.length > 0){
		var next_event = schedule[0]
		var current_time = new Date().getTime();
		var delta_time = next_event.get_time()-current_time
		if (delta_time < -linger_time){
			console.log("Culling")
			schedule.splice(0,1)
		}
	}
}

var time_format = new Intl.NumberFormat('en-US', {
	minimumIntegerDigits: 2,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})

function render_schedule() {

	var rows = output_table.length

	for (var i = 0;i<rows;i++){
		var next_event = schedule[i]
		if (next_event != null){
			var current_time = new Date().getTime();
			var delta_time = next_event.get_time()-current_time
			delta_time = delta_time/1000
			if (delta_time > -linger_time){
				delta_time = Math.max(delta_time,0)
				//output.innerHTML = `<div>${next_event.get_content().text} ${time_format.format(delta_time)}</div>`
				output_table[i].text.innerHTML = next_event.get_content().text
				output_table[i].img.innerHTML = `<img src=${next_event.get_content().img}></img>`
				output_table[i].time.innerHTML = time_format.format(delta_time)
			}
		}
		else{
			output_table[i].text.innerHTML = ""
			output_table[i].img.innerHTML = ""
			output_table[i].time.innerHTML = ""
		}
	}
}

//listen for pasted (ctrl-v) images, usually used in the browser version of an app
a1lib.PasteInput.listen(img => {
	processImg(img);
}, (err, errid) => {
	title.insertAdjacentHTML("beforeend", `<div><b>${errid}</b>  ${err}</div>`);
});

const interval = setInterval(function() {
 	capture()
	cull_schedule()
	render_schedule()
   }, 100);

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}
