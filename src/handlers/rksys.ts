import { IFileHandler } from "../handler.js";
import { RksysFile } from "../filetypes/rksys.js";
import { Table, Tabs, arrayToHex, code, endisabled, numToHex, tooltip, yesno } from "../html-utils.js";

const content = document.getElementById("content");

const backgroundColors = [ "#FFD200", "#3C96F0", "#E61414", "#96CD01" ];

export class RksysHandler implements IFileHandler {
    displayName: string = "rksys.dat";
    file: RksysFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new RksysFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }

    createTable() {
        const p: Record<string, any> = this.file.parsed;
        
        if (p.signature != 0x524B5344) {
            content.innerText = "File is not a valid rksys.dat file!";
            return;
        }

        let table = new Table();
        table.addFullHeader("Global Data");

        table.addRow("Settings", p.globalData.settings);
        table.addRow("Region ID", p.globalData.regionId);

        content.classList.add("flex-container");
        content.append(table.element);

        var tabs = new Tabs("rksys-licenses");
        for (let i = 0; i < 4; i++) {
            let [tab, anchor, tab_body] = tabs.createTab(`License ${i+1}`);
            tab_body.classList.add("flex-container");

            let rkpd = p.profiles[i];
            let table = new Table();
            
            table.addRow("Mii Name", String.fromCharCode(...rkpd.miiName));
            table.addRow("Mii Avatar ID", numToHex(rkpd.miiAvatarId, 8, true));
            table.addRow("Mii Client ID", numToHex(rkpd.miiClientId, 8, true));
            table.addRow("DWC Pseudo User ID", rkpd.dwcPseudoUserId);
            table.addRow("DWC Pseudo Player ID", rkpd.dwcPseudoPlayerId);
            table.addRow("DWC Authentic User ID", rkpd.dwcAuthenticUserId);
            table.addRow("DWC Authentic Player ID", rkpd.dwcAuthenticPlayerId);

            tab_body.appendChild(table.element);
            tab_body.style.height = "fit-content";
        }
        tabs.displayTabs();
        content.appendChild(tabs.element);
        tabs.anchors[0].click();
    }
}
