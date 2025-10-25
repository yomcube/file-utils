import { IFileHandler } from "../handler.js";
import { Wiimj2dFile } from "../filetypes/wiimj2d.js";
import { Table, arrayToHex, code, endisabled, numToHex, tooltip, yesno } from "../html-utils.js";

const content = document.getElementById("content");

export class Wiimj2dHandler implements IFileHandler {
    displayName: string = "wiimj2d.sav";
    file: Wiimj2dFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new Wiimj2dFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }

    createTable() {
        const p: Record<string, any> = this.file.parsed;
        
        var table: Table = new Table();

        

        content.appendChild(table.element);
    }
}
