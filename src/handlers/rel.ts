import { IFileHandler } from "../handler.js";
import { RELFile } from "../filetypes/rel.js";
import { WiiRelocationType } from "../common/wii.js";
import { Table, sanitize, numToHex, tooltip, Details } from "../html-utils.js";

const content = document.getElementById("content");

export class RELHandler implements IFileHandler {
    displayName: string = "REL";
    file: RELFile = {} as RELFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new RELFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }
    
    createTable() {
        if (content == null) return;
        const d: Record<string, any> = this.file.data;

        var table: Table = new Table();

        table.addRow("ID", d.id);
        table.addRow("Number of sections", d.numSections);
        table.addRow("Section info offset", numToHex(d.sectionInfoOffset, 0, true));
        table.addRow("PLF path offset", numToHex(d.nameOffset, 0, true));
        table.addRow("PLF path string size", d.nameSize);
        table.addRow("Version", d.version);
        table.addRow("Size of BSS section", numToHex(d.bssSize, 0, true));
        table.addRow("First relocation list offset", numToHex(d.relOffset, 0, true));
        table.addRow("Imp table offset", numToHex(d.impOffset, 0, true));
        table.addRow("Imp table size", d.impSize);
        table.addRow("Prolog section index", d.prologSection);
        table.addRow("Epilog section index", d.epilogSection);
        table.addRow("Unresolved section index", d.unresolvedSection);

        for (let [v, n, f] of [
            [d.prolog,     "Prolog",     "_prolog"    ],
            [d.epilog,     "Epilog",     "_epilog"    ],
            [d.unresolved, "Unresolved", "_unresolved"]]
        ) {
            table.addRow(
                tooltip(`${n} offset`, `Offset to the specified section of the ${f} function`), numToHex(v, 0, true)
            );
        }
        
        table.addRow("Align", d.align ?? "N/A");
        table.addRow("BSS align", d.bssAlign ?? "N/A");
        table.addRow("Fix size", d.fixSize ?? "N/A");

        // Imp table
        let impTable: Table = new Table();
        impTable.addHeader("Module ID", "Relocation list offset");
        for (let imp of d.impTable) {
            impTable.addRow(imp.moduleId, numToHex(imp.relocationOffset, 0, true));
        }
        table.addRow("Imp table", impTable.element);

        // Relocations
        let relTable: Table = new Table();
        relTable.addHeader("Offset", "Type", "Module", "Section", "Addend");
        for (let rel of d.relocations) {
            let idString: string = rel.moduleId + (
                rel.moduleId == 0 ? " (main.dol)" : rel.moduleId == d.id ? " (self)" : ""
            );
            relTable.addRow(
                numToHex(rel.offset, 0, true),
                WiiRelocationType[rel.type],
                idString,
                rel.moduleId == d.id ? d.sections[rel.section].name : rel.section,
                numToHex(rel.addend, 0, true)
            );
        }
        let relDetails: Details = new Details("View relocation table", "rel-relocation-table");
        relDetails.appendChild(relTable.element);
        table.addRow("Relocations", relDetails.element);

        // Sections
        let secTable: Table = new Table();
        secTable.addHeader("Name", "Offset", "Size", "Index");

        for (let i = 0; i < d.numSections; i++) {
            let sec = d.sections[i];
            if (sec.offset == 0 && sec.size == 0) continue;

            secTable.addRow(
                sec.name,
                numToHex(sec.offset, 0, true),
                numToHex(sec.size, 0, true),
                i.toString()
            );
        }
        table.addRow("Sections", secTable.element);

        // Symbols
        let symTable: Table = new Table();
        symTable.addHeader("Name", "Section", "Offset");
        for (let sym of d.symbols) {
            symTable.addRow(
                sanitize(sym.name),
                d.sections[sym.section].name,
                numToHex(sym.offset, 0, true)
            );
        }
        table.addRow("Discovered symbols", symTable.element);

        content.appendChild(table.element);

        if (this.file.out != "") {
            let pre = document.createElement("pre");
            pre.innerText = this.file.out;
            content.appendChild(pre);
        }
    }
}
