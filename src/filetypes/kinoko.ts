// https://github.com/vabold/Kinoko/blob/main/docs/KRKG.md

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export class KRKGFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);
        
        this.structure = new Structure({
            signature: Types.u32(),
            bom: Types.u16(),
            frameCount: Types.u16(),
            majorVersion: Types.u16(),
            minorVersion: Types.u16(),
            dataOffset: Types.u32()
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
