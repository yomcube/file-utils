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
	/*Number*/ length;
	/*bool*/ isLittleEndian;
	idx = 0;
	
	constructor(/*ArrayBuffer*/ bytes, /*bool*/ le) {
		this.bytes = new Uint8Array(bytes);
		this.dataViewBytes = new DataView(bytes);
		this.length = bytes.length;
		this.isLittleEndian = le;
	}

	#autoEndian(e) {
		if (e == undefined) return this.isLittleEndian;
		return e;
	}
	#checkSize(l) {
		if (this.idx + l >= this.length) {
			throw new RangeError(`Could not increase stream length!
idx = ${this.idx}; l = ${l}; length = ${this.length}`);
		}
	}

	/* Common stream functions */
	skip(n) {
		this.#checkSize(n);
		return this.idx += n;
	}
	jump(n) {
		this.#checkSize(n);
		return this.idx = n;
	}
	get index() {
		return this.idx;
	}

	/* Read functions */
	read_u8() {
		this.#checkSize(1);
		return this.bytes[this.idx++];
	}
	read_s16(e) {
		this.#checkSize(2);
		let tmp = this.dataViewBytes.getInt16(this.idx, this.#autoEndian(e));
		this.idx += 2;
		return tmp;
	}
	read_u16(e) {
		this.#checkSize(2);
		let tmp = this.dataViewBytes.getUint16(this.idx, this.#autoEndian(e));
		this.idx += 2;
		return tmp;
	}
	read_s32(e) {
		this.#checkSize(4);
		let tmp = this.dataViewBytes.getInt32(this.idx, this.#autoEndian(e));
		this.idx += 4;
		return tmp;
	}
	read_u32(e) {
		this.#checkSize(4);
		let tmp = this.dataViewBytes.getUint32(this.idx, this.#autoEndian(e));
		this.idx += 4;
		return tmp;
	}
	read_s64_bigint(e) {
		this.#checkSize(8);
		let tmp = this.dataViewBytes.getBigInt64(this.idx, this.#autoEndian(e));
		this.idx += 8;
		return tmp;
	}
	read_u64_bigint(e) {
		this.#checkSize(8);
		let tmp = this.dataViewBytes.getBigUint64(this.idx, this.#autoEndian(e));
		this.idx += 8;
		return tmp;
	}
	read_string(length) {
		this.#checkSize(length);
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return utf8decoder.decode(tmp);
	}
	read_bytes(length) {
		this.#checkSize(length);
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return tmp;
	}
}

class BaseFile {
	/*String*/ name;
	/*Stream*/ stream;
}

{
	var classes = {};
	function addFileHandler(instance, slicestart, sliceend) {
		let name = instance.name;
		classes[name] = {
			instance: instance,
			slicestart: slicestart,
			sliceend: sliceend
		};

		let opt = document.createElement('option');
		opt.value = name;
		opt.innerText = name;
		fileType.appendChild(opt);
	}
	
	function handleFile(obj) {
		var file = fileInput.files[0];

		if (obj.slicestart > file.length) {
			throw new Error("Slice start is greater than file length!");
		}
		if (obj.sliceend > file.length) {
			throw new Error("Slice end is greater than file length!");
		}

		var blob = file.slice(obj.slicestart, obj.sliceend);

		const reader = new FileReader();
		reader.onload = function() {
			obj.instance.reader_load(this.result);
		};
			
		reader.readAsArrayBuffer(blob);
	}

	let _filehandler = function() {
		try {
			handleFile(classes[fileType.value]);
		} catch (ex) {
			if (ex instanceof TypeError) console.error(`Could not find handlers['${fileType.value}']`);
			else throw ex;
		}
	}
	
	fileInput.addEventListener("change", _filehandler, false);
}
