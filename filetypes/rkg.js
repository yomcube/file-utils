// https://wiki.tockdom.com/wiki/RKG_(File_Format)
// https://github.com/vabold/Kinoko/blob/main/source/game/system/GhostFile.hh
class File_RKG extends BaseFile {
	static s_instance = new File_RKG();
	name = "RKG";
	
	identifiers; // rkg_identifiers.js

	// Helper classes
	RKGTime = class {
		min = 0;
		sec = 0;
		mil = 0;
		// https://github.com/vabold/Kinoko/blob/main/source/game/system/Timer.cc
		constructor(/*u32*/ data) {
			this.min = data >> 0x19;
			this.sec = (data >> 0x12) & 0x7F;
		    this.mil = (data >> 8) & 0x3FF;
		}
	}

	F = class {
		static /*RKGTime*/    raceTime;
		static /*u8*/         course;
		static /*u8*/         vehicle;
		static /*u8*/         character;
		static /*u8*/         year;
		static /*u8*/         month;
		static /*u8*/         day;
		static /*u8*/         controller;
		static /*bool*/       compressed;
		static /*u8*/         ghostType;
		static /*bool*/       isAutomatic;
		static /*u16*/        inputSize;
		static /*u8*/         lapCount;
		static /*RKGTime[5]*/ lapSplits = [];
		static /*u8*/         countryCode;
		static /*u8*/         stateCode;
		static /*u16*/        locationCode;
	}

	// Helper functions
	timeString(/*RKGTime*/ time) {
		return `${time.min}:${leftFillNum(time.sec, 2)}.${leftFillNum(time.mil, 3)}`;
	}




	// https://github.com/vabold/Kinoko/blob/main/source/game/system/GhostFile.cc
	initFields() {
		// 0x04 - 0x07
		var data = this.stream.read_u32();
		this.F.raceTime = new this.RKGTime(data);
		this.F.course = data >> 2 & 0x3F;

		// 0x08 - 0x0B
		data = this.stream.read_u32();
		this.F.vehicle = data >> 0x1A;
		this.F.character = data >> 0x14 & 0x3F;
		this.F.year = (data >> 0xD) & 0x7F;
		this.F.month = (data >> 9) & 0xF;
		this.F.day = (data >> 4) & 0x1F;
		this.F.controller = data & 0xF;

		 // 0x0C - 0x0F
		data = this.stream.read_u32();
		this.F.compressed = (data >> 0x1B) & 1;
		this.F.ghostType = data >> 0x12 & 0x7F;
		this.F.isAutomatic = data >> 0x11 & 0x1;
		this.F.inputSize = data & 0xFFFF;

		// 0x10
		this.F.lapCount = this.stream.read_u8();

		// 0x11 - 0x1F
		for (let i = 0; i < 5; i++) {
			this.F.lapSplits[i] = new this.RKGTime(this.stream.read_u32());
			this.stream.skip(-1);
		}

		// 0x34 - 0x37
		this.F.countryCode = this.stream.read_u8();
		this.F.stateCode = this.stream.read_u8();
		this.F.locationCode = this.stream.read_u16();
	}




	handleFile() {
		var file = fileInput.files[0];
		var headerBlob = file.slice(0, 0x88);

		const reader = new FileReader();
		reader.onload = function() {
			File_RKG.s_instance.reader_load(this.result);
		};
			
		reader.readAsArrayBuffer(headerBlob);
	}

	reader_load(res) {
		var headerBuffer = res;
		this.stream = new Stream(headerBuffer, false);

		var isValid = this.stream.read_u32() == 0x524B4744; /*RKGD*/

		if (!isValid) {
			table.hidden = true;
			errorP.hidden = false;
			errorP.innerText = "File is not a valid RKG!";
			return;
		}

		table.hidden = false;
		errorP.hidden = true;
		tbody.innerHTML = "";
		errorP.innerHTML = "";

		this.initFields();

		var html = "";

		html += row("Finish Time", this.timeString(this.F.raceTime));
		html += row("Course", this.identifiers.tracks[this.F.course]);
		html += row("Vehicle", this.identifiers.vehicles[this.F.vehicle]);
		html += row("Character", this.identifiers.characters[this.F.character]);
		html += row("Date", `${this.F.year + 2000}-${this.F.month}-${this.F.day}`);
		html += row("Controller", this.identifiers.controllers[this.F.controller]);
		html += row("Compressed", yesno(this.F.compressed));
		html += row("Ghost Type", this.identifiers.ghostTypes[this.F.ghostType]);
		html += row("Drift Type", this.F.isAutomatic ? "Automatic" : "Manual");
		html += row(
			tooltip("Input Length", "Measured when decompressed and without padding."),
			this.F.inputSize
		);
		html += row("Lap Count", this.F.lapCount);

		let lapsplittext = '';
		for (let i = 0; i < 5; i++) {
			lapsplittext += this.timeString(this.F.lapSplits[i]) + '<br>';
		}
		html += row("Lap Splits", lapsplittext);
		html += row(
			"Country",
			`${this.identifiers.countries[this.F.countryCode]} (${this.F.countryCode})`
		);
		html += row("State Code", codespan('0x' + u8ToHex(this.F.stateCode)));
		html += row(
			"Location Code",
			codespan('0x' + this.F.locationCode.toString(16).padStart(4, "0"))
		);
				
		tbody.innerHTML = html;
	}

}

addFileHandler(File_RKG.s_instance);