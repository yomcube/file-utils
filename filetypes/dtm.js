//https://tasvideos.org/EmulatorResources/Dolphin/DTM
class File_DTM extends BaseFile {
	static s_instance = new File_DTM();
	displayName = "DTM";

	// Fields
	F = class {
		/*String*/ gameId;
		/*bool*/   isWii;
		/*Object*/ controllers;
		/*bool*/   fromSavestate;
		/*u64*/    viCount;
		/*u64*/    inputCount;
		/*u64*/    lagCount;
		/*u32*/    rerecordCount;
		/*String*/ author;
		/*String*/ videoBackend;
		/*String*/ audioEmulator;
		/*u8[16]*/ md5;
		/*u64*/    startTime;
		/*bool*/   savedConfigValid;
		/*bool*/   idleSkipping;
		/*bool*/   dualCore;
		/*bool*/   progressiveScan;
		/*bool*/   dspHLE;
		/*bool*/   fastDiscSpeed;
		/*u8*/     cpuCore;
		/*bool*/   efbAccess;
		/*bool*/   efbCopy;
		/*bool*/   efbCopyToTexture;
		/*bool*/   efbCopyCache;
		/*bool*/   emulateFormatChanges;
		/*bool*/   xfb;
		/*bool*/   xfbReal;
		/*u8*/     memcardsPresent;
		/*bool*/   memcardBlank;
		/*u8*/     bongosPlugged;
		/*bool*/   syncGPUThread;
		/*bool*/   inNetplay;
		/*bool*/   pal60;
		/*u8*/     language;
		/*bool*/   jitBranchFollowing;
		/*String*/ secondDiscIso;
		/*u8[20]*/ dolphinGitRevision;
		/*u8[4]*/  dspIROMHash;
		/*u8[4]*/  dspCOEFHash;
		/*u64*/    tickCount;
	}

	initFields(/*Stream*/ stream) {
		/*0x04-0x09*/ this.F.gameId = stream.read_string(6);
		/*0x0A     */ this.F.isWii = !!stream.read_u8();
		/*0x0B     */ this.F.controllers = stream.read_u8();
		/*0x0C     */ this.F.fromSavestate = !!stream.read_u8();
		/*0x0D-0x14*/ this.F.viCount = stream.read_u64_bigint();
		/*0x15-0x1C*/ this.F.inputCount = stream.read_u64_bigint();
		/*0x1D-0x24*/ this.F.lagCount = stream.read_u64_bigint();
		/*0x25-0x2C*/ stream.skip(8);
		/*0x2D-0x30*/ this.F.rerecordCount = stream.read_u32();
		/*0x31-0x50*/ this.F.author = stream.read_string(32);
		/*0x51-0x60*/ this.F.videoBackend = stream.read_string(16);
		/*0x61-0x70*/ this.F.audioEmulator = stream.read_string(16);
		/*0x71-0x80*/ this.F.md5 = stream.read_bytes(16);
		/*0x81-0x88*/ this.F.startTime = stream.read_u64_bigint();
		/*0x89     */ this.F.savedConfigValid = !!stream.read_u8();
		/*0x8A     */ this.F.idleSkipping = !!stream.read_u8();
		/*0x8B     */ this.F.dualCore = !!stream.read_u8();
		/*0x8C     */ this.F.progressiveScan = !!stream.read_u8();
		/*0x8D     */ this.F.dspHLE = !!stream.read_u8();
		/*0x8E     */ this.F.fastDiscSpeed = !!stream.read_u8();
		/*0x8F     */ this.F.cpuCore = stream.read_u8();
		/*0x90     */ this.F.efbAccess = !!stream.read_u8();
		/*0x91     */ this.F.efbCopy = !!stream.read_u8();
		/*0x92     */ this.F.efbCopyToTexture = !!stream.read_u8();
		/*0x93     */ this.F.efbCopyCache = !!stream.read_u8();
		/*0x94     */ this.F.emulateFormatChanges = !!stream.read_u8();
		/*0x95     */ this.F.xfb = !!stream.read_u8();
		/*0x96     */ this.F.xfbReal = !!stream.read_u8();
		/*0x97     */ this.F.memcardsPresent = stream.read_u8();
		/*0x98     */ this.F.memcardBlank = !!stream.read_u8();
		/*0x99     */ this.F.bongosPlugged = stream.read_u8();
		/*0x9A     */ this.F.syncGPUThread = !!stream.read_u8();
		/*0x9B     */ this.F.inNetplay = !!stream.read_u8();
		/*0x9C     */ this.F.pal60 = !!stream.read_u8();
		/*0x9D     */ this.F.language = stream.read_u8();
		/*0x9E     */ stream.skip(1);
		/*0x9F     */ this.F.jitBranchFollowing = !!stream.read_u8();
		/*0xA0-0xA8*/ stream.skip(9);
		/*0xA9-0xD0*/ this.F.secondDiscIso = stream.read_string(40);
		/*0xD1-0xE4*/ this.F.dolphinGitRevision = stream.read_bytes(20);
		/*0xE5-0xE8*/ this.F.dspIROMHash = stream.read_u32();
		/*0xE9-0xEC*/ this.F.dspCOEFHash = stream.read_u32();
		/*0xED-0xF4*/ this.F.tickCount = stream.read_u64_bigint();
	}

	reader_load(res) {
		var headerBuffer = res;
		this.stream = new Stream(headerBuffer, true);

		var isValid = this.stream.read_u32() == 0x1A4D5444; /*DTM\x1A*/

		if (!isValid) {
			table.hidden = true;
			errorP.hidden = false;
			errorP.innerText = "File is not a valid DTM!";
			return;
		}

		table.hidden = false;
		errorP.hidden = true;
		tbody.innerHTML = "";
		errorP.innerHTML = "";

		this.initFields(this.stream);

		var html = "";

		html += row("Game ID", this.F.gameId);
		html += row("Game Type", this.F.isWii ? "Wii" : "GameCube");

		var controllers = "";
		var first = true;
		for (var i = 0; i < 8; i++) {
			if (this.F.controllers & (1 << i)) {
				controllers += (first ? "" : ", ") + (i/4 < 1 ? "GC " : "Wii ") + ((i % 4) + 1);
				first = false;
			}
		}
		html += row("Controllers", controllers);
		
		html += row("Savestate", yesno(this.F.fromSavestate));
		html += row("VI Count", this.F.viCount);
		html += row("Input Count", this.F.inputCount);
		html += row("Lag Counter", this.F.lagCount);
		html += row("Rerecord Count", this.F.rerecordCount);
		html += row("Author", this.F.author);
		html += row("Video Backend", this.F.videoBackend);
		html += row("Audio Emulator", this.F.audioEmulator);
		html += row("MD5 Hash", codespan(arrayToHex(this.F.md5)));

		var date = new Date((Number)(this.F.startTime * 1000n));
		html += row(
			"Start Time", 
			`${date.toLocaleDateString()} ${date.toLocaleTimeString()} (${codespan(this.F.startTime)})`
		);
		
		html += row("Saved Config Valid", yesno(this.F.savedConfigValid));
		html += row("Idle Skipping", endis(this.F.idleSkipping));
		html += row("Dual Core", endis(this.F.dualCore));
		html += row("Progressive Scan", endis(this.F.progressiveScan));
		html += row("DSP Type", this.F.dspHLE == 0 ? "LLE" : "HLE");
		html += row("Fast Disc Speed", endis(this.F.fastDiscSpeed));
		html += row("EFB Access", endis(this.F.efbAccess));
		html += row("EFB Copy", endis(this.F.efbCopy));
		html += row("Copy EFB To...", this.F.efbCopyToTexture == 0 ? "RAM" : "Texture");
		html += row("Emulate Format Changes", yesno(this.F.emulateFormatChanges));
		html += row("Use XFB Emulation", yesno(this.F.xfb));
		html += row("Use Real XFB Emulation", yesno(this.F.xfbReal));
		
		var memcarda = this.F.memcardsPresent & 1;
		var memcardb = this.F.memcardsPresent & 2;
		var memcards = "";
		// Thank you, vabold!
		//https://discord.com/channels/1230981272139075765/1230981272613028003/1306833437180690494
		if (memcarda) {
			memcards = memcardb ? "A, B" : "A";
		} else {
			memcards = memcardb ? "B" : "None";
		}
		html += row("Memcards Present", memcards);
		
		html += row("Memcard Blank", yesno(this.F.memcardBlank));
		html += row("Sync GPU Thread", endis(this.F.syncGPUThread));
		html += row("Recorded In Netplay Session", yesno(this.F.inNetplay));
		
		var tt = "This setting only applies to Wii games that support both 50 Hz and 60 Hz.";
		html += row(tooltip("PAL60", tt), endis(this.F.pal60));
		
		html += row("Language", hexspan(this.F.language, 2));
		html += row("JIT Branch Following", endis(this.F.jitBranchFollowing));
		html += row("Name of Second Disc ISO", this.F.secondDiscIso);
		html += row("Dolphin Git Revision", codespan(arrayToHex(this.F.dolphinGitRevision)));
		html += row("DSP IROM Hash", hexspan(this.F.dspIROMHash, 8));
		html += row("DSP COEF Hash", hexspan(this.F.dspCOEFHash, 8));
		
		html += row("Tick Count", this.F.tickCount);

		tbody.innerHTML = html;
	}
}

addFileHandler(File_DTM.s_instance, 0, 0x100);
