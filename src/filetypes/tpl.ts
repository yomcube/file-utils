// https://wiki.tockdom.com/wiki/TPL_%28File_Format%29

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export class TPLFile implements IFile {
    stream: Stream;
    structure: Structure;
    data: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);
        
        this.structure = new Structure({
            magic: Types.u32(),
            imgCount: Types.u32(),
            imgTableOffset: Types.u32()
            /*
            imgTable: 
            */
        });

        this.data = this.structure.parse(this.stream);

        var images = [];
        for (let i = 0; i < this.data.imgCount; i++) {
            this.stream.jump(this.data.imgTableOffset + i*8);
            let imgOff = this.stream.read_u32();
            let palOff = this.stream.read_u32();

            // Palette
            this.stream.jump(palOff);
            let pal: TPLPalette = {
                entryCount: this.stream.read_u16(),
                unpacked: !!this.stream.read_u8(),
                _pad: this.stream.read_u8(),
                format: this.stream.read_u32() as TPLPalFormat,
                dataAddr: this.stream.read_u32()
            };

            // Image
            this.stream.jump(imgOff);
            
            let img: TPLImage = {
                height: this.stream.read_u16(),
                width: this.stream.read_u16(),
                format: this.stream.read_u32() as TPLImgFormat,
                dataAddr: this.stream.read_u32(),
                wrapS: this.stream.read_u32(),
                wrapT: this.stream.read_u32(),
                minFilter: this.stream.read_u32(),
                magFilter: this.stream.read_u32(),
                lodBias: this.stream.read_f32(),
                edgeLodEnable: !!this.stream.read_u8(),
                minLod: this.stream.read_u8(),
                maxLod: this.stream.read_u8(),
                unpacked: !!this.stream.read_u8()
            };
        }
    }
}

export interface TPLImage {
    height: number;
    width: number;
    format: TPLImgFormat;
    dataAddr: number;
    wrapS: number;
    wrapT: number;
    minFilter: number;
    magFilter: number;
    lodBias: number;
    edgeLodEnable: boolean;
    minLod: number;
    maxLod: number;
    unpacked: boolean;
}
export enum TPLImgFormat {
    I4,
    I8,
    IA4,
    IA8,
    RGB565,
    RGB5A3,
    RGBA32,
    C4 = 8,
    C8,
    C14X2,
    CMPR = 14,

}

export interface TPLPalette {
    entryCount: number;
    unpacked: boolean;
    _pad: number;
    format: TPLPalFormat;
    dataAddr: number;
}
export enum TPLPalFormat {
    IA8,
    RGB565,
    RGB5A3,
}
