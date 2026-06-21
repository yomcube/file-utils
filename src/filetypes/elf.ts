// https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// https://www.sco.com/developers/gabi/2000-07-17/ch4.eheader.html

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";


function toEndian(e: number): Endian {
    return e == 1 ? Endian.Little : Endian.Big;
}
function word(s: Stream, ctx: any) {
    return ctx.class == 1 ?
        s.read_u32(toEndian(ctx.endianness)) :
        s.read_u64_bigint(toEndian(ctx.endianness));
};
function u16(s: Stream, ctx: any) {
    return s.read_u16(toEndian(ctx.endianness));
}
function u32(s: Stream, ctx: any) {
    return s.read_u32(toEndian(ctx.endianness));
}

export class ELFFile implements IFile {
    stream: Stream;
    structure: Structure;
    data: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer);
        

        this.structure = new Structure({
            magic: Types.u32(Endian.Big),
            class: Types.u8(),
            endianness: Types.u8(),
            version: Types.u8(),
            abi: Types.u8(),
            abiVersion: Types.u8(),
            _pad: Types.byteArray(7),
            type: u16,
            architecture: u16,
            version2: u32,
            entryPoint: word,
            phOff: word,
            shOff: word,
            flags: u32,
            headerSize: u16,
            phEntrySize: u16,
            phNum: u16,
            shEntrySize: u16,
            shNum: u16,
            shNameIdx: u16
        });

        this.data = this.structure.parse(this.stream);

        
    }
}

export enum ELFArchitecture {
	EM_NONE,
	EM_M32,
	EM_SPARC,
	EM_386,
	EM_68K,
	EM_88K,
	EM_860,
	EM_MIPS,
	EM_S370,
	EM_MIPS_RS3_LE,
	EM_PARISC = 15,
	EM_VPP500 = 17,
	EM_SPARC32PLUS,
	EM_960,
	EM_PPC,
	EM_PPC64,
	EM_V800 = 36,
	EM_FR20,
	EM_RH32,
	EM_RCE,
	EM_ARM,
	EM_ALPHA,
	EM_SH,
	EM_SPARCV9,
	EM_TRICORE,
	EM_ARC,
	EM_H8_300,
	EM_H8_300H,
	EM_H8S,
	EM_H8_500,
	EM_IA_64,
	EM_MIPS_X,
	EM_COLDFIRE,
	EM_68HC12,
	EM_MMA,
	EM_PCP,
	EM_NCPU,
	EM_NDR1,
	EM_STARCORE,
	EM_ME16,
	EM_ST100,
	EM_TINYJ,
	EM_FX66 = 66,
	EM_ST9PLUS,
	EM_ST7,
	EM_68HC16,
	EM_68HC11,
	EM_68HC08,
	EM_68HC05,
	EM_SVX,
	EM_ST19,
	EM_VAX,
	EM_CRIS,
	EM_JAVELIN,
	EM_FIREPATH,
	EM_ZSP,
	EM_MMIX,
	EM_HUANY,
	EM_PRISM,
}
export var ELFArchitectureNames: string[] = [
	/*0x00*/ "No specific instruction set",
    /*0x01*/ "AT&T WE 32100",
    /*0x02*/ "SPARC",
    /*0x03*/ "x86",
    /*0x04*/ "Motorola 68000 (M68k)",
    /*0x05*/ "Motorola 88000 (M88k)",
    /*0x06*/ "Intel MCU",
    /*0x07*/ "Intel 80860",
    /*0x08*/ "MIPS",
    /*0x09*/ "IBM System/370",
    /*0x0A*/ "MIPS RS3000 Little-endian",
    /*0x0B-0x0E*/ "Reserved for future use", "Reserved for future use", "Reserved for future use", "Reserved for future use",
    /*0x0F*/ "Hewlett-Packard PA-RISC",
    /*0x10-0x12*/ "None", "None", "None",
    /*0x13*/ "Intel 80960",
    /*0x14*/ "PowerPC",
    /*0x15*/ "PowerPC (64-bit)",
    /*0x16*/ "S390, including S390x",
    /*0x17*/ "IBM SPU/SPC",
    /*0x18-0x1B*/ "Reserved for future use", "Reserved for future use", "Reserved for future use", "Reserved for future use", 
    /*0x1C-0x1F*/ "Reserved for future use", "Reserved for future use", "Reserved for future use", "Reserved for future use", 
    /*0x20-0x23*/ "Reserved for future use", "Reserved for future use", "Reserved for future use", "Reserved for future use",
    /*0x24*/ "NEC V800",
    /*0x25*/ "Fujitsu FR20",
    /*0x26*/ "TRW RH-32",
    /*0x27*/ "Motorola RCE",
    /*0x28*/ "Arm (up to Armv7/AArch32)",
    /*0x29*/ "Digital Alpha",
    /*0x2A*/ "SuperH",
    /*0x2B*/ "SPARC Version 9",
    /*0x2C*/ "Siemens TriCore embedded processor",
    /*0x2D*/ "Argonaut RISC Core",
    /*0x2E*/ "Hitachi H8/300",
    /*0x2F*/ "Hitachi H8/300H",
    /*0x30*/ "Hitachi H8S",
    /*0x31*/ "Hitachi H8/500",
    /*0x32*/ "IA-64",
    /*0x33*/ "Stanford MIPS-X",
    /*0x34*/ "Motorola ColdFire",
    /*0x35*/ "Motorola M68HC12",
    /*0x36*/ "Fujitsu MMA Multimedia Accelerator",
    /*0x37*/ "Siemens PCP",
    /*0x38*/ "Sony nCPU embedded RISC processor",
    /*0x39*/ "Denso NDR1 microprocessor",
    /*0x3A*/ "Motorola Star*Core processor",
    /*0x3B*/ "Toyota ME16 processor",
    /*0x3C*/ "STMicroelectronics ST100 processor",
    /*0x3D*/ "Advanced Logic Corp. TinyJ embedded processor family",
    /*0x3E*/ "AMD x86-64",
    /*0x3F*/ "Sony DSP Processor",
    /*0x40*/ "Digital Equipment Corp. PDP-10",
    /*0x41*/ "Digital Equipment Corp. PDP-11",
    /*0x42*/ "Siemens FX66 microcontroller",
    /*0x43*/ "STMicroelectronics ST9+ 8/16-bit microcontroller",
    /*0x44*/ "STMicroelectronics ST7 8-bit microcontroller",
    /*0x45*/ "Motorola MC68HC16 Microcontroller",
    /*0x46*/ "Motorola MC68HC11 Microcontroller",
    /*0x47*/ "Motorola MC68HC08 Microcontroller",
    /*0x48*/ "Motorola MC68HC05 Microcontroller",
    /*0x49*/ "Silicon Graphics SVx",
    /*0x4A*/ "STMicroelectronics ST19 8-bit microcontroller",
    /*0x4B*/ "Digital VAX",
    /*0x4C*/ "Axis Communications 32-bit embedded processor",
    /*0x4D*/ "Infineon Technologies 32-bit embedded processor",
    /*0x4E*/ "Element 14 64-bit DSP Processor",
    /*0x4F*/ "LSI Logic 16-bit DSP Processor",
    /*0x50-0x5F*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0x60-0x6F*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0x70-0x7F*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0x80-0x8B*/ "None","None","None","None","None","None","None","None","None","None","None","None",
    /*0x8C*/ "TMS320C6000 Family",
    /*0x8D-0x9D*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0x9D-0xAE*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0xAF*/ "MCST Elbrus e2k",
    /*0xB0-0xB6*/ "None","None","None","None","None","None","None",
    /*0xB7*/ "Arm 64-bits (Armv8/AArch64)",
    /*0xB8-0xC9*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0xCA-0xDB*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0xDC*/ "Zilog Z80",
    /*0xDD-0xEC*/ "None","None","None","None","None","None","None","None","None","None","None","None","None","None","None","None",
    /*0xED-0xF2*/ "None","None","None","None","None","None",
    /*0xF3*/ "RISC-V",
    /*0xF4-0xF6*/ "None","None","None",
    /*0xF7*/ "Berkeley Packet Filter",
    /*0xF8-0x100*/ "None","None","None","None","None","None","None","None","None",
    /*0x101*/ "WDC 65C816",
    /*0x102*/ "LoongArch",
];

