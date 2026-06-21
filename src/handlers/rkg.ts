import { IFileHandler } from "../handler.js";
import { RKGFile, RKGTime } from "../filetypes/rkg.js";
import { Table, leftFillNum, numToHex, tooltip, yesno } from "../html-utils.js";
import { strings } from "../strings/rkg.js";

const content: HTMLElement = document.getElementById("content") as HTMLElement;

export class RKGHandler implements IFileHandler {
    displayName: string = "RKG";
    file: RKGFile = {} as RKGFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new RKGFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }

    timeString(time: any): string {
		return `${time.min}:${leftFillNum(time.sec, 2)}.${leftFillNum(time.mil, 3)}`;
	}
    
    createTable() {
        const p: Record<string, any> = this.file.parsed;
        
        if (p.magic != 0x524B4744) {
            content.innerText = "File is not a valid RKG!";
            return;
        }
        
        var table: Table = new Table();

        table.addRow("Finish Time", this.timeString(RKGTime(p.data0)))
		table.addRow("Course", strings.tracks[p.data0 >> 2 & 0x3F]);
		table.addRow("Vehicle", strings.vehicles[p.data1 >> 0x1A]);
		table.addRow("Character", strings.characters[p.data1 >> 0x14 & 0x3F]);
        let year = p.data1 >>> 0xD & 0x7F;
        let month = p.data1 >>> 9 & 0xF;
        let day = p.data1 >>> 4 & 0x1F;
		table.addRow("Date", [year + 2000, leftFillNum(month, 2), leftFillNum(day, 2)].join('-'));
		table.addRow("Controller", strings.controllers[p.data1 & 0xF]);
		table.addRow("Compressed", yesno(p.data2 & 0x10));
		table.addRow("Ghost Type", strings.ghostTypes[p.data2 >> 0x2 & 0x7F]);
		table.addRow("Drift Type", (p.data2 & 2) ? "Automatic" : "Manual");
		table.addRow(
			tooltip("Input Length", "Measured when decompressed and without padding."),
			p.inputSize
		);
		table.addRow("Lap Count", p.lapCount);

		let lapsplittext = '';
		for (let i = 0; i < 5; i++) {
			lapsplittext += this.timeString(p.lapSplits[i]) + '<br>';
		}
		table.addRow("Lap Splits", lapsplittext);
		table.addRow(
			"Country",
			`${strings.countries[p.countryCode]} (${p.countryCode})`
		);
		table.addRow("State Code", numToHex(p.stateCode, 2, true));
		table.addRow("Location Code", numToHex(p.locationCode, 4, true));

        content.appendChild(table.element);
    }
}
