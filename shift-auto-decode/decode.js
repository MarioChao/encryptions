// Automatically decode shift cipher

/* Variables */

const keyGuesses = {
	1: ["i", "a"],
	2: ["ah", "am", "an", "as", "at", "be", "do", "hi", "im", "in", "is", "it", "of", "ok", "on", "so", "to", "up"],
	3: ["hey", "not", "you"],
}

/* Functions */

/**
 * 
 * @param {() => {}} func 
 */
function measureTimeMs(func) {
	let startTime = new Date();
	func();
	let endTime = new Date();
	return endTime.getTime() - startTime.getTime();
}

function positiveMod(num, mod) {
	let result = num % mod;
	if (result < 0) result += Math.abs(mod);
	return result;
}

/**
 * 
 * @param {string} text 
 * @param {number} shift_key 
 */
function shiftTextBy(text, shift_key) {
	// Sanitize
	shift_key = parseInt(shift_key);

	// Shift
	let result = "";
	for (let i = 0; i < text.length; i++) {
		let textChar = text.charAt(i);
		let shiftedKey = textChar;
		if ("A" <= textChar && textChar <= "Z") {
			let newCode = positiveMod(textChar.charCodeAt() - "A".charCodeAt() + shift_key, 26) + "A".charCodeAt();
			shiftedKey = String.fromCharCode(newCode);
		} else if ("a" <= textChar && textChar <= "z") {
			let newCode = positiveMod(textChar.charCodeAt() - "a".charCodeAt() + shift_key, 26) + "a".charCodeAt();
			shiftedKey = String.fromCharCode(newCode);
		}
		result += shiftedKey;
	}
	return result;
}

function decodeText(inputText) {
	// Create regex
	const re = new RegExp("\\w+", "g");

	// Key list
	let keyList = {};

	// Start matching
	let match = re.exec(inputText);
	while (match) {
		// Generate key if possible
		let word = match[0];
		let wordLength = word.length;
		if (keyGuesses[wordLength]) {
			for (let guess of keyGuesses[wordLength]) {
				// Check if word can be shifted from guess
				let canShift = true;
				let shiftNum = positiveMod(guess.toLowerCase().charCodeAt(0) - word.toLowerCase().charCodeAt(0), 26);
				for (let i = 1; i < wordLength; i++) {
					let tmpShiftNum = positiveMod(guess.toLowerCase().charCodeAt(i) - word.toLowerCase().charCodeAt(i), 26);
					if (tmpShiftNum !== shiftNum) {
						canShift = false;
						break;
					}
				}

				// Add key if possible
				if (canShift) {
					if (!keyList[shiftNum]) keyList[shiftNum] = 0;
					keyList[shiftNum]++;
				}
			}
		}
		
		// Match again
		match = re.exec(inputText);
	} 
	re.exec(inputText);

	// Get probable key
	let key = 0;
	for (const tmp of Object.keys(keyList)) {
		if (keyList[tmp] > keyList[key] || !keyList[key]) {
			key = tmp;
		}
	}
	console.log(keyList);
	console.log(key);

	// Get result
	let result = shiftTextBy(inputText, key);
	return result;
}

function onInputChanged() {
	const input = document.getElementById("shift-input");
	const output = document.getElementById("shift-output");
	const duration = document.getElementById("shift-duration");

	// Get input
	let inputText = input.value;

	// Get output
	let result;
	let shiftTime = measureTimeMs(() => {
		result = decodeText(inputText)
	});
	output.innerHTML = result;

	// Duration
	duration.innerText = shiftTime + " ms";
}

function onDOMContentLoaded() {
	const input = document.getElementById("shift-input");
	const decode = document.getElementById("decode");
	input.addEventListener("change", onInputChanged);
	decode.addEventListener("click", onInputChanged);
}

window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
