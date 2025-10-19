import { IFileHandler } from "../handler.js";
import { MK7_DATFile } from "../filetypes/mk7_dat.js";
import { Table, leftFillNum, numToHex, tooltip, yesno } from "../html-utils.js";
import { strings } from "../strings/mk7_dat.js";

const content = document.getElementById("content");

export class MK7_DATHandler implements IFileHandler {
    displayName: string = "MK7 DAT";
    file: MK7_DATFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new MK7_DATFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }

    timeString(mil: number, sec: number, min: number): string {
        return `${min}:${leftFillNum(sec, 2)}.${leftFillNum(mil, 3)}`;
    }
    
    createTable() {
        const p: Record<string, any> = this.file.parsed;

        if (p.signature != 0x43444744) {
            content.innerText = "File is not a valid DAT ghost file!";
            return;
        }
        
        var table: Table = new Table();

        table.addRow(
			tooltip("1st Person Mode", "Raced in 1st person mode 80% of the time"),
			yesno(p.data0 & 0x10)
		);

        let lapType = p.data0 >>> 24 & 7;
        table.addRow(
			"Course Lap Type",
			lapType == 0 ? "Section-based (Beta)" :
			lapType == 1 ? "Section-based" :
			lapType == 3 ? "Lap-based" : "Invalid"
		);

        table.addRow("Finish Time", this.timeString(
            p.data0 >>> 14 & 0x3FF,
            p.data0 >>> 7 & 0x7F,
			p.data0 & 0x7F,
        ));

        let lapSplits = [
            this.timeString(p.data1 >>> 14 & 0x3FF, p.data1 >>> 7 & 0x7F, p.data1 & 0x7F),
            this.timeString(p.data2 >>> 7 & 0x3FF, p.data2 & 0x7F, p.data1 >>> 24 & 0x7F),
            this.timeString(p.data3 & 0x3FF, p.data2 >>> 24 & 0x7F, p.data2 >>> 17 & 0x7F)
        ]
        table.addRow("Lap Splits", lapSplits.join("<br>"));

        table.addRow("Glider", strings.gliders[p.data4 >>> 20 & 0xF]);
        table.addRow("Tires", strings.tires[p.data4 >>> 16 & 0xF]);
        table.addRow("Kart", strings.karts[p.data4 >>> 11 & 0x1F]);
        table.addRow("Character", strings.chars[p.data4 >>> 6 & 0x1F]);
        table.addRow("Course", strings.courses[p.data4 & 0x3F]);
        table.addRow("Mii Name", String.fromCharCode(...p.miiName));
        table.addRow("Country Code", `${p.countryCode} (${numToHex(p.countryCode, 4, true)})`);
        table.addRow(
            "Globe Coordinates",
            `${p.latitude}, ${p.longitude}`
        );

        content.appendChild(table.element);
    }
}
