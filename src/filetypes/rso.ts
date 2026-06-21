// https://wiki.axiodl.com/w/RSO_(File_Format)

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";
import { WiiRelocationType } from "../common/wii.js";

export class RSOFile implements IFile {
    stream: Stream;
    structure: Structure;
    data: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);

        this.structure = new Structure({
            nextLink: Types.u32(),
            prevLink: Types.u32(),
            sectionCount: Types.u32(),
            sectionInfoOff: Types.u32(),
            nameOff: Types.u32(),
            nameSize: Types.u32(),
            version: Types.u32(),
            bssSize: Types.u32(),
            prologSection: Types.u8(),
            epilogSection: Types.u8(),
            unresolvedSection: Types.u8(),
            bssSection: Types.u8(),
            prolog: Types.u32(),
            epilog: Types.u32(),
            unresolved: Types.u32(),

            internalRelOffset: Types.u32(),
            internalRelSize: Types.u32(),
            externalRelOffset: Types.u32(),
            externalRelSize: Types.u32(),
            
            exportTblOff: Types.u32(),
            exportTblSize: Types.u32(),
            exportStrOff: Types.u32(),
            importTblOff: Types.u32(),
            importTblSize: Types.u32(),
            importStrOff: Types.u32(),

            /*
                sections: RSOSection[],
                name: string,
                expSyms: RSOSymbol[],
                impSyms: RSOSymbol[],
                isSel: boolean,
            */
        });

        let d = this.structure.parse(this.stream);

        // Sections
        let sections: RSOSection[] = [];
        this.stream.jump(d.sectionInfoOff);
        for (let i = 0; i < d.sectionCount; i++) {
            sections.push({
                offset: this.stream.read_u32(),
                size: this.stream.read_u32(),
                idx: i, known: false, syms: []
            });
        }
        d.sections = sections;
            console.log(d.sections);

        // Module name
        this.stream.jump(d.nameOff);
        d.name = this.stream.read_string(d.nameSize);

        // Exported symbols
        var expSyms: RSOSymbol[] = [];
        this.stream.jump(d.exportTblOff);
        for (let i = 0; i < d.exportTblSize / 0x10; i++) {
            expSyms.push({
                nameOff: this.stream.read_u32(), symOff: this.stream.read_u32(),
                secIdx:  this.stream.read_u32(), hash:   this.stream.read_u32()
            });
        }
        for (let sym of expSyms) {
            this.stream.jump(d.exportStrOff + sym.nameOff);
            sym.symbol = this.stream.read_string_nt();
            try {
                d.sections[sym.secIdx].syms.push(sym);
            } catch { console.log(`Couldn't push symbol: ${sym.symbol}`); }
        }
        d.expSyms = expSyms;

        // Imported symbols
        var impSyms: RSOSymbol[] = [];
        this.stream.jump(d.importTblOff);
        for (let i = 0; i < d.importTblSize / 0xC; i++) {
            impSyms.push({
                nameOff: this.stream.read_u32(), symOff: this.stream.read_u32(),
                secIdx:  this.stream.read_u32()
            });
        }
        for (let sym of impSyms) {
            this.stream.jump(d.importStrOff + sym.nameOff);
            sym.symbol = this.stream.read_string_nt();
        }
        d.impSyms = impSyms;

        // Relocations
        // TODO


        this.data = d;
        this.sectionAnalysis();
    }
    sectionAnalysis() {
        let nullSections = 0;
        for (let sec of this.data.sections) {
            if (sec.offset == 0) {
                if (sec.size == 0) {
                    nullSections++; continue;
                }
                this.setSec(sec, ".bss");
            }

            let text = this.labelSecFromSyms(sec, ".text", [
                "__register_global_object", "__destroy_global_chain",
                "__init_cpp_exceptions", "__fini_cpp_exceptions"
            ]);
            // Fall back to _prolog, _epilog, _unresolved
            if (text == false &&
                sec.idx == this.data.prologSection &&
                sec.idx == this.data.epilogSection &&
                sec.idx == this.data.unresolvedSection
            ) {
                this.setSec(sec, ".text");
            }

            this.labelSecFromSyms(sec, ".ctors", [
                "_ctors", "__init_cpp_exceptions_reference"
            ]);
            this.labelSecFromSyms(sec, ".dtors", [
                "_dtors", "__fini_cpp_exceptions_reference", "__destroy_global_chain_reference"
            ]);

            console.log(sec);
            sec.name = sec.known ? sec.name : `.section${sec.idx}`;
        }
        this.data.isSel = nullSections == this.data.sectionCount;
    }
    #symbolsFound: string[] = [];
    labelSecFromSyms(sec: RSOSection, secName: string, symNames: string[]): boolean|null {
        if (sec.known) return null;
        let res = sec.syms.filter((sym: RSOSymbol) => {
            return symNames.some((name: string) => name == sym.symbol);
        }).length > 0;
        if (res) {
            this.setSec(sec, secName);
            return true;
        }
        return false;
    }
    setSec(sec: RSOSection, name: string) {
        sec.known = true;
        sec.name = name;
        this.#symbolsFound.push(name);
    }
}

export interface RSOSection {
    offset: number;
    size: number;
    idx: number;
    name?: string;
    known: boolean;
    syms: RSOSymbol[];
};

export interface RSOSymbol {
    nameOff: number;
    symOff: number;
    secIdx: number;
    symbol?: string;
    hash?: number;
}