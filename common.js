/**********************/
/****** Elements ******/
/**********************/
const fileType  = document.getElementById("fileType");
const fileInput = document.getElementById("fileInput");
const errorP    = document.getElementById("errorP");
const options   = document.getElementById("options");
const table     = document.getElementById("table");
const tbody     = document.getElementById("tbody");


/******************************/
/****** Common Variables ******/
/******************************/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
const platform_littleEndian = (() => {
	const buffer = new ArrayBuffer(2);
	new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
	// Int16Array uses the platform's endianness.
	return new Int16Array(buffer)[0] === 256;
})();

const utf8decoder = new TextDecoder();


/******************************/
/****** Helper Functions ******/
/******************************/
function yesno(val) {
	return val ? "Yes" : "No";
}
function endis(val) {
	return val ? "Enabled" : "Disabled";
}
	
// https://www.xaymar.com/articles/2020/12/08/fastest-uint8array-to-hex-string-conversion-in-javascript/
function arrayToHex(data) {
	return Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
}
function u8ToHex(x) {
	return ('00' + x.toString(16)).slice(-2);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
function leftFillNum(num, targetLength) {
	return num.toString().padStart(targetLength, "0");
}
	
function row(p, v) {
	return `<tr><th>${p}</th><td>${v}</td></tr>\n`;
}
function codespan(s) {
	return `<span class="code">${s}</span>`;
}
function tooltip(text, tttext) {
	return `<span class="tooltip" data-tooltip="${tttext}">${text}</span>`;
}

/************************/
/****** Common API ******/
/************************/

class Stream {
	/*Uint8Array*/ bytes;
	/*DataView*/ dataViewBytes;
	/*bool*/ isLittleEndian;
	idx = 0;
	
	constructor(/*ArrayBuffer*/ bytes, /*bool*/ le) {
		this.bytes = new Uint8Array(bytes);
		this.dataViewBytes = new DataView(bytes);
		this.isLittleEndian = le;
	}

	read_u8() {
		return this.bytes[this.idx++];
	}
	read_u16() {
		let tmp = this.dataViewBytes.getUint16(this.idx, this.isLittleEndian);
		this.idx += 2;
		return tmp;
	}
	read_u32() {
		let tmp = this.dataViewBytes.getUint32(this.idx, this.isLittleEndian);
		this.idx += 4;
		return tmp;
	}
	read_u64_bigint() {
		let tmp = this.dataViewBytes.getBigUint64(this.idx, this.isLittleEndian);
		this.idx += 8;
		return tmp;
	}
	read_string(length) {
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return utf8decoder.decode(tmp);
	}
	read_bytes(length) {
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return tmp;
	}
	skip(n) {
		return this.idx += n;
	}
	jump(n) {
		return this.idx = n;
	}
	get index() {
		return this.idx;
	}
}

class BaseFile {
	/*String*/ name;
	/*Stream*/ stream;

	// File handling
	handleFile() {
		throw new Error("Inherit this class and override this method!");
	}
}

{
	var handlers = {};
	function addFileHandler(klassObj) {
		let name = klassObj.name;
		handlers[name] = klassObj.handleFile;

		let opt = document.createElement('option');
		opt.value = name;
		opt.innerText = name;
		fileType.appendChild(opt);
	}
	
	let _filehandler = function() {
		try {
			handlers[fileType.value]();
		} catch (ex) {
			if (ex instanceof TypeError) console.error(`Could not find handlers['${fileType.value}']`);
			else throw ex;
		}
	}
	
	fileInput.addEventListener("change", _filehandler, false);
}
