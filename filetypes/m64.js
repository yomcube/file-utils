// https://tasvideos.org/EmulatorResources/Mupen/M64
class File_M64 extends BaseFile {
	static s_instance = new File_M64();
	name = "M64";
	isLittleEndian = true;

	ExtData = class {
		authorship;
		bruteforcing;
		rerecordHighWord;
		reserved;

		constructor(au, br, re, res) {
			this.authorship = au;
			this.bruteforcing = br;
			this.rerecordHighWord = re;
			this.reserved = res;
		}
	};

	F = class {
		static /*u32*/         version;
		static /*u32*/         uid;
		static /*u32*/         frameCount;
		static /*u32*/         rerecordCount;
		static /*u8*/          fps;
		static /*u8*/          numOfControllers;
		static /*u8*/          extendedVersion;
		static /*u8*/          extendedFlags;
		static /*u32*/         inputSamples;
		static /*u16*/         movieStartType;
		static /*u32*/         controllerFlags;
		static /*ExtData*/     extendedData;
		static /*String[32]*/  internalRomName;
		static /*u32*/         crc32;
		static /*u16*/         countryCode;
		static /*String[64]*/  videoPlugin;
		static /*String[64]*/  soundPlugin;
		static /*String[64]*/  inputPlugin;
		static /*String[64]*/  rspPlugin;
		static /*String[222]*/ author;
		static /*String[256]*/ description;
	};

	initFields() {
		/*0x008*/ this.F.uid = this.stream.read_u32();
		/*0x00C*/ this.F.frameCount = this.stream.read_u32();
		/*0x010*/ this.F.rerecordCount = this.stream.read_u32();
		/*0x014*/ this.F.visPS = this.stream.read_u8();
		/*0x015*/ this.F.numOfControllers = this.stream.read_u8();
		/*0x016*/ this.F.extendedVersion = this.stream.read_u8();
		/*0x017*/ this.F.extendedFlags = this.stream.read_u8();
		/*0x018*/ this.F.inputSamples = this.stream.read_u32();
		/*0x01C*/ this.F.movieStartType = this.stream.read_u16();
		/*0x01E*/ this.stream.skip(2);
		/*0x020*/ this.F.controllerFlags = this.stream.read_u32();
		/*0x024*/ this.F.extendedData = new this.ExtData(
			this.stream.read_u32(false),
			this.stream.read_u32(false),
			this.stream.read_u32(false),
			this.stream.read_bytes(20)
		);
		/*0x044*/ this.stream.skip(128);
		/*0x0C4*/ this.F.internalRomName = this.stream.read_string(32);
		/*0x0E4*/ this.F.crc32 = this.stream.read_u32(false);
		/*0x0E8*/ this.F.countryCode = this.stream.read_u16(false);
		/*0x0EA*/ this.stream.skip(56);
		/*0x122*/ this.F.videoPlugin = this.stream.read_string(64);
		/*0x162*/ this.F.soundPlugin = this.stream.read_string(64);
		/*0x1A2*/ this.F.inputPlugin = this.stream.read_string(64);
		/*0x1E2*/ this.F.rspPlugin = this.stream.read_string(64);
		/*0x222*/ this.F.author = this.stream.read_string(222);
		/*0x300*/ this.F.description = this.stream.read_string(256);
	}

	reader_load(res) {
		var headerBuffer = res;
		this.stream = new Stream(headerBuffer, true);

		var isValid = this.stream.read_u32(false) == 0x4D36341A &&
			(this.F.version = this.stream.read_u32(true)) == 3; /*M64\x1A*/
		
		if (!isValid) {
			table.hidden = true;
			errorP.hidden = false;
			errorP.innerText = "File is not a valid v3 M64!";
			return;
		}

		table.hidden = false;
		errorP.hidden = true;
		tbody.innerHTML = "";
		errorP.innerHTML = "";

		this.initFields();

		var html = "";

		html += row("Version", this.F.version);
		html += row("UID", codespan('0x' + this.F.uid.toString(16).padStart(8, '0')));
		html += row("Frame Count", this.F.frameCount);
		html += row("Rerecord Count", this.F.rerecordCount);
		html += row("VIs per second", this.F.visPS);
		html += row("Number of Controllers", this.F.numOfControllers);
		html += row("Extended Version Number", this.F.extendedVersion);

		var extFlags = []
		if (this.F.extendedFlags == 0) {
			extFlags = [ "None" ];
		}
		else {
			if (this.F.extendedFlags & 1) {
				extFlags.append("WiiVC emulation mode");
			}
		}
		html += row("Extended Flags", extFlags.join(', '));
		html += row("Input Samples", this.F.inputSamples);

		var startType;
		switch (this.F.movieStartType) {
			case 1:
				startType = 'From savestate';
				break;
			case 2:
				startType = 'From power-on';
				break;
			case 4:
				startType = 'From EEPROM';
				break;
			default:
				startType = 'Invalid';
		}
		html += row("Movie Start Type", `${startType} (${this.F.movieStartType})`);

		var contPresent = [];
		var mempaks = [];
		var rumblepaks = [];
		
		for (var i = 0; i < 4; i++) {
			var ip1Str = (i+1).toString();

			if (this.F.controllerFlags & (1 << i))
				contPresent.push(ip1Str);

			if (this.F.controllerFlags & (1 << (i+4)))
				mempaks.push(ip1Str);

			if (this.F.controllerFlags & (1 << (i+8)))
				rumblepaks.push(ip1Str);
		}

		var controllerFlagsStr = `
Controllers Present: ${contPresent.length == 0 ? "None" : contPresent.join(", ")}<br>
MemPaks Present: ${mempaks.length == 0 ? "None" : mempaks.join(", ")}<br>
RumblePaks Present: ${rumblepaks.length == 0 ? "None" : rumblepaks.join(", ")}`;

		html += row("Controller Flags", controllerFlagsStr);

		var extdata = "Extended version is 0.<br>No extended data is available.";
		if (this.F.extendedVersion != 0) {
			var authorship = utf8decoder.decode(this.F.extendedData.authorship);
			extdata = `Movie Creation Program: ${authorship}<br>
Bruteforcing Data: ${this.F.extendedData.bruteforcing}<br>
High Word of Rerecord Count: ${this.F.extendedData.rerecordHighWord}<br>
Reserved: ${arrayToHex(this.F.extendedData.reserved)}`
		}
		html += row(
			tooltip("Extended Data", "Only valid if the extended version is non-zero."),
			extdata
		)
		
		html += row("Internal ROM Name", this.F.internalRomName);
		html += row("CRC32 of ROM", codespan('0x' + this.F.crc32.toString(16).padStart(8, '0')));
		html += row("Country code of ROM", codespan('0x' + this.F.countryCode.toString(16).padStart(4, '0')));
		html += row("Video Plugin", this.F.videoPlugin);
		html += row("Audio Plugin", this.F.soundPlugin);
		html += row("Input Plugin", this.F.inputPlugin);
		html += row("RSP Plugin", this.F.rspPlugin);

		tbody.innerHTML = html;
	}

}

addFileHandler(File_M64.s_instance, 0, 0x400);
