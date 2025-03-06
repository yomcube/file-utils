// https://mkdd.org/wiki/GHT_(File_Format)
class File_GHT extends BaseFile {
	static s_instance = new File_GHT();
	name = "GHT";

	F = class {
		static /*u8*/ char1;
		static /*u8*/ char2;
		static /*u8*/ kart;
		static /*u8*/ course;
		static /*String[4]*/ tag;
		static /*u32*/ totaltime;
		static /*u32*/ totalinputs;
		static /*u32*/ lap1;
		static /*u32*/ lap2;
		static /*u32*/ lap3;
		static /*u32*/ lap4;
		static /*u32*/ lap5;
		static /*u32*/ lap6;
	}

	initFields(/*Stream*/ stream) {
		/*0x00*/ this.F.char1 = stream.read_u8();
		/*0x01*/ this.F.char2 = stream.read_u8();
		/*0x02*/ this.F.kart = stream.read_u8();
		/*0x03*/ this.F.course = stream.read_u8();
		/*0x04*/ this.F.tag = stream.read_string(4);
		/*0x08*/ this.F.totaltime = stream.read_u32();
		/*0x0C*/ this.F.totalinputs = stream.read_u32();
		/*0x10*/ this.F.lap1 = stream.read_u32();
		/*0x14*/ this.F.lap2 = stream.read_u32();
		/*0x18*/ this.F.lap3 = stream.read_u32();
		/*0x1C*/ this.F.lap4 = stream.read_u32();
		/*0x20*/ this.F.lap5 = stream.read_u32();
		/*0x24*/ this.F.lap6 = stream.read_u32();
	}

	reader_load(res) {
		var headerBuffer = res;
		this.stream = new Stream(headerBuffer, false);

		var isValid = true; // No file magic or anything

		if (!isValid) {
			table.hidden = true;
			errorP.hidden = false;
			errorP.innerText = "File is not a valid GHT!";
			return;
		}

		table.hidden = false;
		errorP.hidden = true;
		tbody.innerHTML = "";
		errorP.innerHTML = "";

		this.initFields(this.stream);

		var html = "";

		
		
		tbody.innerHTML = html;
	}

}

//addFileHandler(File_GHT.s_instance, 0, 0x28);
