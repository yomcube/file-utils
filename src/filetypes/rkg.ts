// https://wiki.tockdom.com/wiki/RKG_(File_Format)
// https://github.com/vabold/Kinoko/blob/main/source/game/system/GhostFile.hh
// https://github.com/vabold/Kinoko/blob/main/source/game/system/GhostFile.cc

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export function RKGTime(data: Uint8Array | number) {
    if (typeof data == "number") {
        return {
			min: data >>> 25,
			sec: (data >>> 18) & 0x7F,
		    mil: (data >>> 8) & 0x3FF,
		};
    }
    return {
        min: data[0] >>> 1,
        sec: (data[0] & 1 << 6) | data[1] >>> 2,
        mil: ((data[1] << 8) | data[2]) & 0x3FF
    };
}

export function RKGTimeStructType() {
    return ((stream) => {
        console.log(stream.index);
        return RKGTime(stream.read_bytes(3));
    });
}

export class RKGFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);
        
        this.structure = new Structure({
            /*0x00*/ magic: Types.u32(),
            /*0x04*/ data0: Types.u32(),
            /*0x08*/ data1: Types.u32(),
            /*0x0C*/ data2: Types.u16(),
            /*0x0E*/ inputSize: Types.u16(),
            /*0x10*/ lapCount: Types.u8(),
            /*0x11*/ lapSplits: Types.array(RKGTimeStructType(), 5),
            /*0x20*/ userData: Types.byteArray(0x14),
            /*0x34*/ countryCode: Types.u8(),
            /*0x35*/ stateCode: Types.u8(),
            /*0x36*/ locationCode: Types.u16(),
            /*0x38*/ unknown: Types.u32(),
            /*0x3C*/ miiData: Types.byteArray(0x4A),
            /*0x86*/ miiCRC: Types.u16()
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
