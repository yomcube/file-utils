import { IFileHandler } from "../handler.js";
import { KRKGFile } from "../filetypes/kinoko.js";
import { Table, leftFillNum, numToHex, tooltip, yesno } from "../html-utils.js";

const content = document.getElementById("content");

type Vector3f = { x: number, y: number, z: number };
function Vector3f_read(stream): Vector3f {
    return { x: stream.read_f32(), y: stream.read_f32(), z: stream.read_f32() };
}
type Quatf = { v: Vector3f, w: number };
function Quatf_read(stream): Quatf {
    return { v: Vector3f_read(stream), w: stream.read_f32() };
}

export class KRKGHandler implements IFileHandler {
    displayName: string = "Kinoko KRKG";
    file: KRKGFile;
    handleFile(file: File): void {
        file.arrayBuffer().then((buffer) => {
            this.file = new KRKGFile( new Uint8Array(buffer) );
            this.createTable();
        });
    }
    
    createTable() {
        const p: Record<string, any> = this.file.parsed;
        
        if (p.signature != 0x4b524b47) {
            content.innerText = "File is not a valid KRKG!";
            return;
        }

        if (p.bom != 0xfeff) {
            content.innerText = "File has an incorrect BOM!";
            return;
        }
        
        var table: Table = new Table();

        table.addRow("Frame Count", p.frameCount);
        table.addRow("Version", `${p.majorVersion}.${p.minorVersion}`);
        table.addRow("Data Offset", numToHex(p.dataOffset, 8));

        let framedata = [];
        let s = this.file.stream;
        for (let frame = 0; frame < p.frameCount; frame++) {
            framedata.push({
                pos: Vector3f_read(s),
                fullRot: Quatf_read(s),
                extVel: Vector3f_read(s),
                intVel: Vector3f_read(s),
                speed: s.read_f32(),
                acceleration: s.read_f32(),
                softSpeedLimit: s.read_f32(),
                mainRot: Quatf_read(s),
                angVel2: Vector3f_read(s),
                raceCompletion: s.read_f32(),
                checkpointId: s.read_u16(),
                jugemId: s.read_u8(),
                padding: s.read_u8()
            });
        }
        
        let container = document.createElement("div");

        let frameTable = new Table();
        frameTable.element.id = "frameTable";
        this.createFrameTable(0, framedata, frameTable.element);
        
        let label = document.createElement("label");
        label.htmlFor = "frameInput";
        label.innerText = "Frame:  ";
        container.appendChild(label);
        
        let frameInput = document.createElement("input");
        frameInput.type = "number";
        frameInput.id = "frameInput";
        frameInput.min = "0";
        frameInput.max = (p.frameCount - 1).toString();
        frameInput.value = "0";
        frameInput.placeholder = "0";
        container.appendChild(frameInput);

        container.appendChild(frameTable.element);

        table.addRow("Frame Data", container.innerHTML);

        content.appendChild(table.element);

        document.getElementById("frameInput").addEventListener("input", (ev) => {
            console.log("input");
            this.createFrameTable((ev.target as HTMLInputElement).value, framedata, document.getElementById("frameTable") as HTMLTableElement);
        }, true);
    }

    V3f_toStr(v: Vector3f) { return `(${v.x}, ${v.y}, ${v.z})` }
    Qf_toStr(q: Quatf) { return `(${this.V3f_toStr(q.v)}, ${q.w})` }
    createFrameTable(frame, data, e) {
        let table = new Table(e);
        table.clear();
        table.addRow("pos", this.V3f_toStr(data[frame].pos));
        table.addRow("fullRot", this.Qf_toStr(data[frame].fullRot));
        table.addRow("extVel", this.V3f_toStr(data[frame].extVel));
        table.addRow("intVel", this.V3f_toStr(data[frame].intVel));
        table.addRow("speed", data[frame].speed);
        table.addRow("acceleration", data[frame].acceleration);
        table.addRow("softSpeedLimit", data[frame].softSpeedLimit);
        table.addRow("mainRot", this.Qf_toStr(data[frame].mainRot));
        table.addRow("angVel2", this.V3f_toStr(data[frame].angVel2));
        table.addRow("raceCompletion", data[frame].raceCompletion);
        table.addRow("checkpointId", data[frame].checkpointId);
        table.addRow("jugemId", data[frame].jugemId);
        return table;
    }
}
