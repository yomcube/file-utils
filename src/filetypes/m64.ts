// https://tasvideos.org/EmulatorResources/Mupen/M64

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export function ExtData() {
    return ((s: Stream) => {
        return {
            specialAuthor: s.read_u32(),
            bruteforcing: s.read_u32(),
            rerecordingHighWord: s.read_u32(),
            reserved: s.read_bytes(20)
        }
    });
}

export class M64File implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Little);
        
        this.structure = new Structure({
            signature: Types.u32(),
            version: Types.u32(),
            uid: Types.u32(),
            frameCount: Types.u32(),
            rerecordCount: Types.u32(),
            visPS: Types.u8(),
            numOfControllers: Types.u8(),
            extendedVersion: Types.u8(),
            extendedFlags: Types.u8(),
            inputSamples: Types.u32(),
            movieStartType: Types.u16(),
            reserved0: Types.u16(),
            controllerFlags: Types.u32(),
            extendedData: ExtData(),
            reserved1: Types.byteArray(128),
            internalRomName: Types.str(32),
            crc32: Types.u32(Endian.Big),
            countryCode: Types.u16(Endian.Big),
            reserved2: Types.byteArray(56),
            videoPlugin: Types.str(64),
            soundPlugin: Types.str(64),
            inputPlugin: Types.str(64),
            rspPlugin: Types.str(64),
            author: Types.str(222),
            description: Types.str(256),
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
