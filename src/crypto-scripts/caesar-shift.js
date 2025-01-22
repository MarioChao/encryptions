// Caesar Cipher
// Shift each English letter according to a numerical key

// Constants
const alphabetSize = 26;

// Local functions
function parseKey(key) {
	// Make sure the key is a number
	let resultKey = parseInt(key) % alphabetSize;
	return resultKey;
}

function isLowercase(c) {
	let char = c.charAt(0);
	return ('a' <= char) && (char <= 'z');
}

function isUppercase(c) {
	let char = c.charAt(0);
	return ('A' <= char) && (char <= 'Z');
}

function getLetterPosition(c) {
	// Get the position of the letter in the English alphabet (a=0, b=1, ...)
	let char = c.charAt(0);
	let charAscii = char.charCodeAt();
	if (isLowercase(char)) {
		return charAscii - 'a'.charCodeAt();
	} else if (isUppercase(char)) {
		return charAscii - 'A'.charCodeAt();
	} else {
		return -1;
	}
}

function positiveMod(number, divisor) {
	let resultNumber = number % divisor;
	if (resultNumber < 0) {
		resultNumber += Math.abs(divisor);
	}
	return resultNumber;
}

function shiftLetter(c, shiftIndex) {
	// Get character information
	let char = c.charAt(0);
	let charPosition = getLetterPosition(char);

	// Shift letter
	let newPosition = positiveMod(charPosition + shiftIndex, alphabetSize);
	let resultChar = '\0';
	if (isLowercase(char)) {
		let newAscii = 'a'.charCodeAt() + newPosition;
		resultChar = String.fromCharCode(newAscii);
	} else if (isUppercase(char)) {
		let newAscii = 'A'.charCodeAt() + newPosition;
		resultChar = String.fromCharCode(newAscii);
	}
	return resultChar;
}

// Encryption functions
function caesarEncrypt(text, key, repeatCount) {
	// Reduce repeat count
	repeatCount %= alphabetSize;
	
	// Go through each letter
	let resultText = "";
	for (let char of text) {
		// Validate English letter
		let charPosition = getLetterPosition(char);
		if (charPosition == -1) {
			/* Not an English letter */
			resultText += char;
			continue;
		}

		// Append the shifted letter
		let shiftIndex = (key * repeatCount) % alphabetSize;
		let newChar = shiftLetter(char, shiftIndex);
		resultText += newChar;
	}

	// Return
	return resultText;
}

function caesarDecrypt(text, key, repeatCount) {
	// Decrypt is just encrypting with a negative key
	return caesarEncrypt(text, key, -repeatCount);
}

// Encrypt node functions
function caesarEncryptFull(text, nodeInfo) {
	// Get variables
	let key = parseKey(nodeInfo.key);
	let repeatCount = parseInt(nodeInfo.repeatCount);

	// Encrypt
	let resultText = caesarEncrypt(text, key, repeatCount);

	// Return
	return {
		result: resultText,
		success: true,
	};
}

function caesarDecryptFull(text, nodeInfo) {
	// Get variables
	let key = parseKey(nodeInfo.key);
	let repeatCount = parseInt(nodeInfo.repeatCount);
	
	// Encrypt
	let resultText = caesarDecrypt(text, key, repeatCount);

	// Return
	return {
		result: resultText,
		success: true,
	};
}

function getEncryptNodeParameter() {
	return {
		key: true,
		repeatCount: true,
	};
}

function getDecryptNodeParameter() {
	return {
		key: true,
		repeatCount: true,
	};
}

// Function module
let functionModule = {};

functionModule.encrypt = caesarEncryptFull;
functionModule.decrypt = caesarDecryptFull;

functionModule.encryptNodeParameter = getEncryptNodeParameter();
functionModule.decryptNodeParameter = getDecryptNodeParameter();

export { functionModule };
