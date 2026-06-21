// https://wiki.tockdom.com/wiki/REL_%28File_Format%29

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";
import { WiiRelocationType } from "../common/wii.js";

export class RELFile implements IFile {
    stream: Stream;
    structure: Structure;
    data: Record<string, any>;
    out: string = "";

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);
        
        this.structure = new Structure({
            id: Types.u32(),
            next: Types.u32(),
            prev: Types.u32(),
            numSections: Types.u32(),
            sectionInfoOffset: Types.u32(),
            nameOffset: Types.u32(),
            nameSize: Types.u32(),
            version: Types.u32(),
            bssSize: Types.u32(),
            relOffset: Types.u32(),
            impOffset: Types.u32(),
            impSize: Types.u32(),
            prologSection: Types.u8(),
            epilogSection: Types.u8(),
            unresolvedSection: Types.u8(),
            bssSection: Types.u8(),
            prolog: Types.u32(),
            epilog: Types.u32(),
            unresolved: Types.u32(),
            align: Types.t_if(ctx=> ctx.version >= 2, Types.u32()),
            bssAlign: Types.t_if(ctx=> ctx.version >= 2, Types.u32()),
            fixSize: Types.t_if(ctx=> ctx.version >= 3, Types.u32()),
            /* Extra data not in the header
                impTable: RELImp[],
                relocations: RELRelocation[],
                sections: RELSection[],
                symbols: RELSymbol[],
            */
        });

        this.data = this.structure.parse(this.stream);
        this.data.symbols = [];

        this.readImp();
        this.readRelocations();
        this.readSections();

        console.log(this.data);
    }

    readImp(): void {
        let imps: RELImp[] = [];

        this.stream.jump(this.data.impOffset);
        for (let i = 0; i < this.data.impSize / 8; i++) {
            imps.push(new RELImp(this.stream));
        }
        this.data.impTable = imps;
    }

    readRelocations(): void {
        let rels: RELRelocation[] = [];

        for (let imp of this.data.impTable) {
            this.stream.jump(imp.relocationOffset);

            while (true) {
                let rel = new RELRelocation(this.stream);
                if (rel.type == WiiRelocationType.R_RVL_STOP) break;
                rel.moduleId = imp.moduleId;
                rels.push(rel);
            }
        }

        this.data.relocations = rels;
    }

    readSections(): void {
        let sections: RELSection[] = [];

        this.stream.jump(this.data.sectionInfoOffset);
        for (let i = 0; i < this.data.numSections; i++) {
            let sec = new RELSection(i, this.stream);
            sec.index = i;
            sections.push(sec);
        }

        this.findCtorsDtors(sections);
        this.findPrologEpilogUnresolved(sections);
        this.data.sections = sections;
    }

    // https://github.com/encounter/decomp-toolkit/blob/06749b8/src/analysis/pass.rs#L120-L262
    findCtorsDtors(sections: RELSection[]): void {
        let possibleSections = sections.filter((section, sectionIdx) => {
            if (section.known || section.size < 4) return false;

            let currentAddress = section.offset;
            let sectionEnd = section.offset + section.size;


            let rel: RELRelocation = this.data.relocations.find((rel: RELRelocation) =>
                rel.moduleId == this.data.id &&
                rel.section == sectionIdx &&
                rel.addend == currentAddress &&
                rel.type == WiiRelocationType.R_PPC_ADDR32
            );
            if (rel) {
                let target_section = this.data.sections[rel.section];
                if (target_section.idx != rel.section) { return false; }
                if (!target_section.executable) { return false; }
                currentAddress += 4;
                if (currentAddress > sectionEnd) { return false; }
            }
            if (currentAddress + 4 != sectionEnd) { return false; }

            return true;
        });

        if (possibleSections.length != 2) {
            console.log(this.out = "Could not find .ctors and .dtors");
            return;
        };

        let [ctors, dtors] = possibleSections;
        ctors.name = ".ctors";
        ctors.known = true;
        this.data.symbols.push(new RELSymbol("_ctors", ctors.index!, ctors.offset));
        
        dtors.name = ".dtors";
        dtors.known = true;
        this.data.symbols.push(new RELSymbol("_dtors", dtors.index!, dtors.offset));
    }

    findPrologEpilogUnresolved(sections: RELSection[]) {
        [["_prolog", this.data.prologSection, this.data.prolog],
        ["_epilog", this.data.epilogSection, this.data.epilog],
        ["_unresolved", this.data.unresolvedSection, this.data.unresolved]]
        .forEach((x) => {
            if (!x[1]) return;
            this.data.symbols.push(new RELSymbol(x[0], x[1], x[2]));
        });
    }
}

export class RELImp {
    moduleId: number;
    relocationOffset: number;

    constructor(strm: Stream) {
        this.moduleId = strm.read_u32();
        this.relocationOffset = strm.read_u32();
    }
}

export class RELRelocation {
    offset: number;
    type: number;
    section: number;
    addend: number;
    moduleId: number | null = null;

    constructor(strm: Stream) {
        this.offset = strm.read_u16();
        this.type = strm.read_u8();
        this.section = strm.read_u8();
        this.addend = strm.read_u32();
    }
}

export class RELSection {
    offset: number;
    size: number;
    executable: boolean;
    name: string | null;
    known: boolean;
    index: number | null = null;

    constructor(idx: number, strm: Stream) {
        this.offset = strm.read_u32();
        this.size = strm.read_u32();
        this.executable = !!(this.offset & 1);
        this.offset &= ~3;

        // https://github.com/encounter/decomp-toolkit/blob/06749b8/src/util/rel.rs#L398-L408
        [this.name, this.known] =
            this.offset == 0 ? [".bss", true] :
            this.executable ? [".text", true] :
            [`.section${idx}`, false];
    }
}

export class RELSymbol {
    name: string;
    section: number;
    offset: number;

    constructor(name: string, section: number, offset: number) {
        this.name = name;
        this.section = section;
        this.offset = offset;
    }
}
