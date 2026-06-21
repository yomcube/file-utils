import { IFileHandler } from "../handler.js";
import { DTMFile } from "../filetypes/dtm.js";
import { Table, arrayToHex, code, endisabled, numToHex, tooltip, yesno } from "../html-utils.js";

const content = document.getElementById("content");

export class DTMHandler implements IFileHandler {
    displayName: string = "DTM";
    file: DTMFile = {} as DTMFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new DTMFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }

    createTable() {
        if (content == null) return;
        
        const p: Record<string, any> = this.file.parsed;
        
        if (p.filetype != 0x1A4D5444) {
            content.innerText = "File is not a valid DTM!";
            return;
        }
        
        var table: Table = new Table();

        table.addRow("Game ID", p.gameID);
        table.addRow("Game Type", p.bWii ? "Wii" : "GameCube");

        var controllers = "";
		var controllers_first = true;
		for (var i = 0; i < 8; i++) {
			if (p.controllers & (1 << i)) {
				controllers += (controllers_first ? "" : ", ") + (i/4 < 1 ? "GC " : "Wii ") + ((i % 4) + 1);
				controllers_first = false;
			}
		}
        table.addRow("Controllers", controllers);

        table.addRow("Savestate", yesno(p.bFromSaveState));
		table.addRow("VI Count", p.frameCount);
		table.addRow("Input Count", p.inputCount);
		table.addRow("Lag Counter", p.lagCount);
		table.addRow("Rerecord Count", p.numRerecords);
		table.addRow("Author", p.author);
		table.addRow("Video Backend", p.videoBackend);
		table.addRow("Audio Emulator", p.audioEmulator);
		table.addRow("MD5 Hash", arrayToHex(p.md5, true));

        var date = new Date((Number)(p.recordingStartTime * 1000n));
		table.addRow(
			"Start Time", 
			`${date.toLocaleDateString()} ${date.toLocaleTimeString()} (${code(p.recordingStartTime)})`
		);
		
		table.addRow("Saved Config Valid", yesno(p.bSaveConfig));
		table.addRow("Idle Skipping", endisabled(p.bSkipIdle));
		table.addRow("Dual Core", endisabled(p.bDualCore));
		table.addRow("Progressive Scan", endisabled(p.bProgressive));
		table.addRow("DSP Type", p.bDSPHLE == 0 ? "LLE" : "HLE");
		table.addRow("Fast Disc Speed", endisabled(p.bFastDiscSpeed));

        const cpucore = ["Interpreter", "JIT", "JITL"]
        table.addRow("CPU Core", cpucore[p.CPUCore]);

		table.addRow("EFB Access", endisabled(p.bEFBAccessEnable));
		table.addRow("EFB Copy", endisabled(p.bEFBCopyEnable));
		table.addRow("Copy EFB To...", p.bSkipEFBCopyToRam ? "Texture" : "RAM");
		table.addRow("EFB Copy Cache Enabled", endisabled(p.bEFBCopyCacheEnable));
		table.addRow("Emulate Format Changes", yesno(p.bEFBEmulateFormatChanges));
		table.addRow("Use XFB Emulation", yesno(p.bImmediateXFB));
		table.addRow("Use Real XFB Emulation", yesno(p.bSkipXFBCopyToRam));

        const memcards = ["None", "A", "B", "A, B"];
        table.addRow("Memcards Present", memcards[p.memcards]);

        table.addRow("New Memcard", yesno(p.bClearSave));

        var bongos = "";
		var bongos_first = true;
		for (var i = 0; i < 4; i++) {
			if (p.bongos & (1 << i)) {
				bongos += (bongos_first ? "" : ", ") + ((i % 4) + 1);
				bongos_first = false;
			}
		}
        table.addRow("Bongos Plugged", bongos);

		table.addRow("Sync GPU Thread", endisabled(p.bSyncGPU));
		table.addRow("Recorded In Netplay Session", yesno(p.bNetPlay));
        table.addRow(
            tooltip("PAL60", "This setting only applies to Wii games that support both 50 Hz and 60 Hz."),
            endisabled(p.bPAL60)
        );

        table.addRow("Language", numToHex(p.language, 2, true));
		table.addRow("JIT Branch Following", endisabled(p.bFollowBranch));
        table.addRow("Accurate FMA emulation", endisabled(p.bUseFMA));

        var gbas = "";
		var gbas_first = true;
		for (var i = 0; i < 4; i++) {
			if (p.GBAControllers & (1 << i)) {
				gbas += (gbas_first ? "" : ", ") + ((i % 4) + 1);
				gbas_first = false;
			}
		}
        table.addRow("GBA Controllers Plugged", gbas);

        table.addRow("SYSCONF Widescreen", endisabled(p.bWidescreen));
        table.addRow("SYSCONF Country Code", endisabled(p.countryCode));
		table.addRow("Name of Second Disc ISO", p.discChange);
		table.addRow("Dolphin Git Revision", code(arrayToHex(p.revision)));
		table.addRow("DSP IROM Hash", numToHex(p.DSPiromHash, 8, true));
		table.addRow("DSP COEF Hash", numToHex(p.DSPcoefHash, 8, true));
		table.addRow("Tick Count", p.tickCount);

        content.appendChild(table.element);
    }
}
