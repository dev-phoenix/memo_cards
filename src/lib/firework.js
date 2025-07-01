"use client"

import { clearInterval } from "node:timers";
import { useEffect, useState } from "react";

/**
 * firework.js
 * based on: https://www.youtube.com/watch?v=gD1XmiNLcWY
 * src: https://gitlab.com/FilFar/firework-tutorial-javascript-canvas/-/tree/main?ref_type=heads
 */

export default function WinCanvas ({display, closeWin, gameState, setMonitorData}){
	const [display2, setDisplay2] = useState(false)
	// const [display, setDisplay] = useState(false)
	// setDisplay(true)

	let canvas = null; // document.getElementById('canvas'); // Get element by ID canvas
	let ctx = null; // canvas.getContext('2d'); 				// Get concent of canvas 2d graphics
	let frameRate = 60.0;							// Frame rate per second use in loop
	let frameDelay = 1000.0/frameRate;				// Frame Delay per second like latency

	// let clientWidth = innerWidth;					// Clients Width of web screen
	// let clientHeight = innerHeight;					// Clients height of web screen
	let clientWidth = 100;					// Clients Width of web screen
	let clientHeight = 100;					// Clients height of web screen
	let timer = 0;									// Timer is ticker, how many ticks per round
	let x = 0;										// Mouse x coordinates
	let y = 0;										// Mouse y coordinates

	// canvas.width = clientWidth;						// Set canvas width to user width
	// canvas.height = clientHeight;					// Set canvas height to user height

	let TimedFirework = 1000;						// Repeat Firework every x MS
	let LimiterTicker = 0;							// 
	let fireworks = [];								// Array with starting fireworks
	let particles = [];								// Array with particles
	let typecount = 1;								// Variable to change firework type
	let sparks = [];								// Array for sparkles drops
	let num = 1;									// number of color
	let colorchanger = 0;							// colorchange timer

	// Function to calculate distance = Simple Pythagorean theorem
	function distance(px1, py1, px2, py2) {
		let xdis = px1 - px2;
		let ydis = py1 - py2;
		return Math.sqrt((xdis*xdis) + (ydis*ydis));
	}

	// My own created function to get angle from point to point
	function getAngle(posx1, posy1, posx2, posy2) {
		if (posx1 == posx2) { if (posy1 > posy2) { return 90; } else { return 270; } }
		if (posy1 == posy2) { if (posy1 > posy2) { return 0; } else { return 180; } }

		let xDist = posx1 - posx2;
		let yDist = posy1 - posy2;

		if (xDist == yDist) { if (posx1 < posx2) { return 225; } else { return 45; } }
		if (-xDist == yDist) { if (posx1 < posx2) { return 135; } else { return 315; } }

		if (posx1 < posx2) {
			return Math.atan2(posy2-posy1, posx2-posx1)*(180/Math.PI) + 180;
		} else {
			return Math.atan2(posy2-posy1, posx2-posx1)*(180/Math.PI) + 180;
		}
	}

	// My function to create random number
	function random(min, max, round) {
		if (round == 'round') {
			return Math.round(Math.random() * (max - min) + min);
		} else {
			return Math.random() * (max - min) + min;
		}
	}

	// Function to choose one of these best colors
	function colors() {
		if (timer > colorchanger) { num = random(0, 7, 'round'); colorchanger = timer + (500); }
		num = random(0, 7, 'round'); 
		switch(num) {
			case 1: return '#ff0000'; break;
			case 2: return '#ffff00'; break;
			case 3: return '#00ff00'; break;
			case 4: return '#00ffff'; break;
			case 5: return '#ffff00'; break;
			case 5: return '#0000ff'; break;
			case 6: return '#ff00ff'; break;
			case 7: return '#ffac00'; break;
		}
	}

	// Function to make firework
	let createFirework = function() {

		let firework = new Firework();

		firework.x = firework.sx = clientWidth/2;
		firework.y = firework.sy = clientHeight;

		firework.color = colors();

		if (x != 0 && y != 0) {
			firework.tx = x;
			firework.ty = y;
			x = y = 0;
		} else {
			firework.tx = random(400, clientWidth-400);
			firework.ty = random(0, clientHeight / 2);
		}

		let angle = getAngle(firework.sx, firework.sy, firework.tx, firework.ty);

		firework.vx = Math.cos(angle * Math.PI/180.0);
		firework.vy = Math.sin(angle * Math.PI/180.0);

		fireworks.push(firework);
	}

	// Function to start Firework
	let Firework = function() {

		this.x = 0;
		this.y = 0;
		this.sx = 0;
		this.sy = 0;
		this.tx = 0;
		this.ty = 0;
		this.vx = 0;
		this.vy = 0;
		this.color = 'rgb(255,255,255)';
		this.dis = distance(this.sx, this.sy, this.tx, this.ty);
		this.speed = random(700, 1100);
		this.gravity = 1.5;
		this.ms = 0;
		this.s = 0;
		this.del = false;

		this.update = function(ms) {
			this.ms = ms / 1000;

			if (this.s > 2000/ms) {
				if (typecount == 4) { typecount = 1; } else { typecount++; }
				createParticles(typecount, 30, this.x, this.y, this.color);
				this.del = true;
			} else {
				this.speed *= 0.98;
				this.x -= this.vx * this.speed * this.ms;
				this.y -= this.vy * this.speed * this.ms - this.gravity;
			}

			this.s++;
		}

		this.draw = function() {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	// Function to create array particles
	const createParticles = function(type, count, pox, poy, color) {
		for (let i = 0; i < count; i++) {
			let par = new Particles();
			par.type = type;

			par.color = color;
			par.x = pox;
			par.y = poy;

			let angle = random(0, 360);
			par.vx = Math.cos(angle * Math.PI/180.0);
			par.vy = Math.sin(angle * Math.PI/180.0);

			particles.push(par);
		};
	}

	// Function to make particles
	let Particles = function() {

		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.speed = random(200, 500);
		this.gravity = 1;
		this.wind = 0;
		this.type = 1;
		this.opacity = 1;
		this.s = 0;
		this.scale = 1;
		this.color = '#FFF';
		this.del = false;

		this.update = function(ms) {
			this.ms = ms / 1000;

			if (this.s > 900/ms) { if (this.opacity - 0.05 < 0) { this.opacity = 0; } else { this.opacity -= 0.05; } }

			if (this.type == 1) {
				this.speed *= 0.96;
				this.x -= this.vx * this.speed * this.ms + this.wind;
				this.y -= this.vy * this.speed * this.ms - this.gravity;
			} else if (this.type == 2) {
				if (this.s < 800/ms) { this.scale += 0.1; } else { this.scale -= 0.2; }
				this.speed *= 0.96;
				this.x -= this.vx * this.speed * this.ms + this.wind;
				this.y -= this.vy * this.speed * this.ms - this.gravity;
			} else if (this.type == 3) {
				this.speed *= 0.95;
				this.x -= this.vx * this.speed * this.ms + this.wind;
				this.y -= this.vy * this.speed * this.ms;
			} else if (this.type == 4) {
				this.speed *= 0.96;
				this.x -= this.vx * this.speed * this.ms + this.wind;
				this.y -= this.vy * this.speed * this.ms - this.gravity;

				let spark = new Sparkler();
				spark.x = this.x;
				spark.y = this.y;
				spark.vx = Math.cos(random(0, 360, 'round') * (Math.PI/180))*1.05;
				spark.vy = Math.sin(random(0, 360, 'round') * (Math.PI/180))*1.05;
				spark.tx = this.x;
				spark.ty = this.y;
				spark.color = this.color;
				spark.limit = random(4, 10, 'round');
				sparks.push(spark);
			} else {

			}

			this.s++;
		}

		this.draw = function() {
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;

			if (this.type == 1) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI);
				ctx.fill();
			} else if (this.type == 2) {
				ctx.translate(this.x, this.y);
				ctx.scale(this.scale, this.scale);
				ctx.beginPath();
				ctx.fillRect(0, 0, 1, 1);
			} else if (this.type == 3) {
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x - this.vx * 10, this.y - this.vy * 10);
				ctx.stroke();
			} else if (this.type == 4) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI);
				ctx.fill();
			} else {
				ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
				ctx.fill();
			}

			ctx.closePath();
			ctx.restore();
		}
	}

	// Function for sparkler type of firework
	let Sparkler = function() {

		this.x = 0;
		this.y = 0;
		this.tx = 0;
		this.ty = 0;
		this.limit = 0;
		this.color = 'red';

		this.update = function() {
			this.tx += this.vx;
			this.ty += this.vy;

			this.limit--;
		}

		this.draw = function() {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.tx, this.ty);
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();
		}
	}

	const text = function() {
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.font = "14px arial";
		ctx.fillText("You can change the Firework style with right click and fire with left click on mouse.", 2, clientHeight-2);
	}
// 
	const textWin = function() {
		let text = "You WIN!"
		if(gameState == 3){
			text = "You LOSE!"
		}
		let fsize = clientWidth / text.length
		let x = clientWidth / 2 - fsize * 2, y = clientHeight / 2 + fsize / 2
		ctx.beginPath();
		ctx.fillStyle = 'white';
		// ctx.font = `32px arial`;
		ctx.font = `${fsize}px arial`;
		// console.log(text, x, y)
		// x = 100, y = 100
		// console.log(text, x, y)
		ctx.fillText(text, x, y);
	}

	const clearObject = (obj, otype) => {
		console.log(`remove object ${otype}:`, obj)
	}

	const update = function(frame) {
		if(!display){
			return;
		}

		// ctx.clearRect(0, 0, clientWidth, clientHeight);
		// Every tick clear screen with black rectangle with opacity 0.15
		let blackFon = true;
		if(blackFon){
			ctx.globalAlpha = 1;
			let colr = 11.99
			ctx.fillStyle = `rgba(${colr}, ${colr}, ${colr}, 0.15)`;
			// ctx.fillStyle = 'rgb(10, 10, 10)';
			// ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			ctx.fillRect(0, 0, clientWidth, clientHeight);
		}

		// text to controll firework
		// text();
		textWin();


		if (timer > LimiterTicker) {
			// Creating array with starting Firework
			createFirework();

			LimiterTicker = timer + (TimedFirework / frame);
		}

		let i = fireworks.length;
		while(i--) {
			// Progress starting Fireworks
			if (fireworks[i].del == true) { let toRemF = fireworks.splice(i, 1); } else {
				fireworks[i].update(frame);
				fireworks[i].draw();
			}
		}

		i = particles.length;
		while(i--) {
			// Progress particles
			if (particles[i].opacity == 0) { let toRemP = particles.splice(i, 1); } else {
				particles[i].update(frame);
				particles[i].draw();
			}
		}

		i = sparks.length;
		while(i--) {
			// Progress sparks
			if (sparks[i].limit < 0) { let toRemS = sparks.splice(i, 1); } else {
				sparks[i].update(frame);
				sparks[i].draw();
			}
		}

		timer++;
	}

	let mainIntervalInit = false
	let mainInterval = false

	useEffect(() => {
		// window.oncontextmenu = function () { return false; } // Block menu
		canvas = document.getElementById('canvas'); // Get element by ID canvas
		canvas = document.querySelector('.canvas'); // Get element by ID canvas
		ctx = canvas.getContext('2d'); 				// Get concent of canvas 2d graphics

		clientWidth = innerWidth;					// Clients Width of web screen
		clientHeight = innerHeight;					// Clients height of web screen

		let box = canvas.getBoundingClientRect()

		clientWidth = box.width	;					// Clients Width of web screen
		clientHeight = box.height;					// Clients height of web screen

		canvas.width = clientWidth;						// Set canvas width to user width
		canvas.height = clientHeight;					// Set canvas height to user height

		update(frameDelay);

		// Mouse coordinates to fire
		canvas.addEventListener('mousedown', function(evt) {
			evt = evt || window.event;
			let button = evt.which || evt.button;
			if (button == 1) {
				// If button is first (left) on mouse
				x = evt.clientX; y = evt.clientY; createFirework();
			} else {
				// If button is second (right) on mouse
				if (typecount == 4) { typecount = 1; } else { typecount++; }
			}
		});
		update(frameDelay);
		
		mainIntervalInit = true
		// let main = setInterval(function() { update(frameDelay); }, frameDelay);
		mainInterval = setInterval(function() { update(frameDelay); }, frameDelay);
		if(display && !mainInterval){
			mainInterval = setInterval(function() { update(frameDelay); }, frameDelay);
		}

	}, [])

	if(mainIntervalInit){
		textWin();
		if(display && !mainInterval){
			mainInterval = setInterval(function() { update(frameDelay); }, frameDelay);
		}
		if(!display && mainInterval){
			clearInterval(mainInterval);
			mainInterval = false;
		}
	}
	let monitor_data = {}
	monitor_data["display"] = display;
	monitor_data["mainInterval"] = mainInterval;
	monitor_data["mainIntervalInit"] = mainIntervalInit;
	setMonitorData((state) => ({ ...state, ...monitor_data }))

	return (
		<>
			<div className={"win-bg" + (display?' d-b':'')}></div>
	        <canvas i-d="canvas" className={"canvas win-bg" + (display?' d-b':'')} onClick={closeWin}>Canvas is not supported in your browser or you don't have enabled Javascripts.</canvas>
		</>
	)
}