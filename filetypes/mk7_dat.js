// https://mk3ds.com/index.php?title=DAT_%28File_Format%29
// https://github.com/Bsquo/MK7GhostReader/blob/main/mk7ghosts.py
class File_MK7_DAT extends BaseFile {
	displayName = "MK7 DAT";

	// Helper classes
	Time = class {
		min = 0;
		sec = 0;
		mil = 0;
		constructor(mil, sec, min) {
			this.min = min;
			this.sec = sec;
		    this.mil = mil;
		}
		toString() {
			return `${this.min}:${leftFillNum(this.sec, 2)}.${leftFillNum(this.mil, 3)}`;
		}
	}

	F = class {
		static /*bool*/ firstPerson;
		static /*u3*/ lapType;
		static /*Time*/ finishTime;
		static /*Time*/ lapSplit1;
		static /*Time*/ lapSplit2;
		static /*Time*/ lapSplit3;
		static /*u4*/ glider;
		static /*u4*/ tires; 
		static /*u5*/ kart;
		static /*u5*/ character;
		static /*u6*/ course;
		static /*String*/ miiName;
		static /*u16*/ countryCode;
		static /*u16*/ latitude;
		static /*u16*/ longitude;
	}

	// Helper functions
	timeString(/*Time*/ time) {
		return `${time.min}:${leftFillNum(time.sec, 2)}.${leftFillNum(time.mil, 3)}`;
	}

	initFields(/*Stream*/ stream) {
		var data = stream.read_u32();
		this.F.firstPerson = data & (1 << 27);
		console.log(this.F.lapType = data >>> 24 & 7);
		this.F.finishTime = new this.Time(
			data >>> 14 & 0x3FF,
			data >>> 7 & 0x7F,
			data & 0x7F
		);

		data = stream.read_u32();
		this.F.lapSplit1 = new this.Time(
			data >>> 14 & 0x3FF,
			data >>> 7 & 0x7F,
			data & 0x7F
		);

		var l2_min = data >>> 24 & 0x7F;
		data = stream.read_u32();
		this.F.lapSplit2= new this.Time(
			data >>> 7 & 0x3FF,
			data & 0x7F,
			l2_min
		);

		var l3_sec = data >>> 24 & 0x7F;
		var l3_min = data >>> 17 & 0x7F;
		data = stream.read_u32();
		this.F.lapSplit3 = new this.Time(
			data & 0x3FF,
			l3_sec,
			l3_min
		);

		data = stream.read_u32();
		this.F.glider = data >>> 20 & 0xF;
		this.F.tires = data >>> 16 & 0xF;
		this.F.kart = data >>> 11 & 0x1F;
		this.F.character = data >>> 6 & 0x1F;
		this.F.course = data & 0x3F;

		data = stream.read_bytes(0x14);
		this.F.miiName = String.fromCharCode(...data);

		stream.skip(100);

		this.F.countryCode = stream.read_u16();
		stream.skip(2);
		this.F.latitude = stream.read_u16();
		this.F.longitude = stream.read_u16();
	}

	reader_load(res) {
		var headerBuffer = res;
		this.stream = new Stream(headerBuffer, true);

		var isValid = this.stream.read_u32() == 0x43444744; /*DGDC = CDGD*/

		if (!isValid) {
			table.hidden = true;
			errorP.hidden = false;
			errorP.innerText = "File is not a valid DAT!";
			return;
		}

		table.hidden = false;
		errorP.hidden = true;
		tbody.innerHTML = "";
		errorP.innerHTML = "";

		this.initFields(this.stream);

		var html = "";

		var s = strings[this.displayName];

		html += row(
			tooltip("1st Person Mode", "Raced in 1st person mode 80% of the time"),
			yesno(this.F.firstPerson)
		);
		html += row(
			"Course Lap Type",
			this.F.lapType == 0 ? "Section-based (Beta)" :
			this.F.lapType == 1 ? "Section-based" :
			this.F.lapType == 3 ? "Lap-based" : "Invalid"
		);
		html += row("Finish Time", this.timeString(this.F.finishTime));
		html += row("Lap Splits", [
			this.timeString(this.F.lapSplit1),
			this.timeString(this.F.lapSplit2),
			this.timeString(this.F.lapSplit3)
		].join("<br>"));

		html += row("Glider", s.gliders[this.F.glider]);
		html += row("Tires", s.tires[this.F.tires]);
		html += row("Kart", s.karts[this.F.kart]);
		html += row("Character", s.chars[this.F.character]);
		html += row("Course", s.courses[this.F.course]);
		html += row("Mii Name", this.F.miiName);
		html += row(
			"Country Code",
			`${this.F.countryCode} (${hexspan(this.F.countryCode, 4)})`
		);
		html += row(
			"Globe Coordinates (Lat, Long)",
			`${hexspan(this.F.latitude, 4)}, ${hexspan(this.F.longitude, 4)}`
		);
				
		tbody.innerHTML = html;
	}

}

addFileHandler(new File_MK7_DAT(), 0, 0xC0);
