// https://mk3ds.com/index.php?title=DAT_%28File_Format%29
// https://github.com/Bsquo/MK7GhostReader/blob/main/mk7ghosts.py
import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export class MK7_DATFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Little);
        
        this.structure = new Structure({
            signature: Types.u32(),
            data0: Types.u32(),
            data1: Types.u32(),
            data2: Types.u32(),
            data3: Types.u32(),
            data4: Types.u32(),
            miiName: Types.byteArray(0x14),
            unknown0: Types.u32(),
            miiData: Types.byteArray(0x60),
            countryCode: Types.u16(),
            unknown1: Types.u16(),
            latitude: Types.u16(),
            longitude: Types.u16(),
            unknown2: Types.u32(),
            unknown3: Types.u32(),
            unknown4: Types.byteArray(0x20)
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
