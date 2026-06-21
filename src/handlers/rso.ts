import { IFileHandler } from "../handler.js";
import { RSOFile, RSOSymbol } from "../filetypes/rso.js";
import { WiiRelocationType } from "../common/wii.js";
import { Table, Details, numToHex, sanitize } from "../html-utils.js";

const content = document.getElementById("content");

export class RSOHandler implements IFileHandler {
    displayName: string = "RSO";
    file: RSOFile = {} as RSOFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new RSOFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }
    
    createTable() {
        if (content == null) return;
        const d: Record<string, any> = this.file.data;

        var table: Table = new Table();

        table.addRow("Section Count", d.sectionCount);
        table.addRow("Module Name", d.name);
        table.addRow("Module Version", d.version);
        table.addRow("BSS Size", d.bssSize);
        table.addRow("Prolog Section Index", d.prologSection);
        table.addRow("Epilog Section Index", d.epilogSection);
        table.addRow("Unresolved Section Index", d.unresolvedSection);
        table.addRow("Prolog Function Offset", numToHex(d.prolog, 0, true));
        table.addRow("Epilog Function Offset", numToHex(d.epilog, 0, true));
        table.addRow("Unresolved Function Offset", numToHex(d.unresolved, 0, true));

        // Sections
        var secTable: Table = new Table();
        secTable.width = 3;
        secTable.addHeader("Index", "Offset", "Size");
        for (let i = 0; i < d.sectionCount; i++) {
            let s = d.sections[i];
            if (s.offset == 0 && s.size == 0) continue;
            secTable.addRow(s.name, numToHex(s.offset, 0, true), numToHex(s.size, 0, true));
        }
        table.addRow("Sections", secTable.element);

        // Exported symbols
        var expTable: Table = new Table(null, 3);
        expTable.addHeader("Section", "Offset", "Name");
        d.expSyms.sort((a: RSOSymbol, b: RSOSymbol) => {
            return a.secIdx - b.secIdx || a.symOff - b.symOff;
        });
        for (let sym of d.expSyms) {
            let sec = d.isSel ? sym.secIdx.toString() :
                sym.secIdx > d.sectionCount ? `.section${sym.secIdx}` :
                d.sections[sym.secIdx].name;
            expTable.addRow(sec, numToHex(sym.symOff, 0, true), sanitize(sym.symbol));
        }
        let expDetails: Details = new Details("View exported symbols", "rso-exported-symbols");
        expDetails.appendChild(expTable.element);
        table.addRow("Exported Symbols", expDetails.element);

        // Imported symbols
        var impTable: Table = new Table(null, 1);
        d.impSyms.sort();
        for (let sym of d.impSyms) {
            impTable.addRow(sanitize(sym.symbol));
        }
        let impDetails: Details = new Details(
            "View imported symbols", d.isSel ? null : "rso-imported-symbols"
        );
        impDetails.appendChild(impTable.element);
        table.addRow("Imported Symbols", impDetails.element);

        content.appendChild(table.element);
    }
}
