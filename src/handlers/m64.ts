import { IFileHandler } from "../handler.js";
import { M64File } from "../filetypes/m64.js";
import { Table, arrayToHex, leftFillNum, numToHex, tooltip } from "../html-utils.js";

const content = document.getElementById("content");
const utf8decoder = new TextDecoder();

export class M64Handler implements IFileHandler {
    displayName: string = "M64";
    file: M64File;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new M64File( new Uint8Array(buffer) );
            this.createTable();
        });
    }
    
    createTable() {
        const p: Record<string, any> = this.file.parsed;
        
        if (p.signature != 0x1A34364D) {
            content.innerText = "File is not a valid M64!";
            return;
        }
        
        var table: Table = new Table();

        table.addRow("Version", p.version);
		table.addRow("UID", numToHex(p.uid, 8, true));
		table.addRow("Frame Count", p.frameCount);
		table.addRow("Rerecord Count", p.rerecordCount);
		table.addRow("VIs per second", p.visPS);
		table.addRow("Number of Controllers", p.numOfControllers);
		table.addRow("Extended Version Number", p.extendedVersion);

		table.addRow("Extended Flags", (p.extendedFlags & 1) ? "WiiVC Emulation mode" : "None");
		table.addRow("Input Samples", p.inputSamples);

		var startType;
		switch (p.movieStartType) {
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
		table.addRow("Movie Start Type", `${startType} (${p.movieStartType})`);

		var contPresent = [];
		var mempaks = [];
		var rumblepaks = [];
		for (var i = 0; i < 4; i++) {
			var ip1Str = (i+1).toString();

			if (p.controllerFlags & (1 << i))
				contPresent.push(ip1Str);

			if (p.controllerFlags & (1 << (i+4)))
				mempaks.push(ip1Str);

			if (p.controllerFlags & (1 << (i+8)))
				rumblepaks.push(ip1Str);
		}
		var controllerFlagsStr = `
Controllers Present: ${contPresent.length == 0 ? "None" : contPresent.join(", ")}<br>
MemPaks Present: ${mempaks.length == 0 ? "None" : mempaks.join(", ")}<br>
RumblePaks Present: ${rumblepaks.length == 0 ? "None" : rumblepaks.join(", ")}`;
		table.addRow("Controller Flags", controllerFlagsStr);

		var extdata = "Extended version is 0.<br>No extended data is available.";
		if (p.extendedVersion != 0) {
			var authorship = utf8decoder.decode(p.extendedData.authorship);
			extdata = `Movie Creation Program: ${authorship}<br>
Bruteforcing Data: ${p.extendedData.bruteforcing}<br>
High Word of Rerecord Count: ${p.extendedData.rerecordHighWord}<br>
Reserved: ${arrayToHex(p.extendedData.reserved)}`
		}
		table.addRow(
			tooltip("Extended Data", "Only valid if the extended version is non-zero."),
			extdata
		)
		
		table.addRow("Internal ROM Name", p.internalRomName);
		table.addRow("CRC32 of ROM", numToHex(p.crc32, 8, true));
		table.addRow("Country code of ROM", numToHex(p.countryCode, 4, true));
		table.addRow("Video Plugin", p.videoPlugin);
		table.addRow("Audio Plugin", p.soundPlugin);
		table.addRow("Input Plugin", p.inputPlugin);
		table.addRow("RSP Plugin", p.rspPlugin);

        content.appendChild(table.element);
    }
}
