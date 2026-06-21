import { Endian, Stream } from "./stream.js";
export * as Types from "./structure_types.js";

export class Structure {
    struct: object;

    constructor(struct: object) {
        this.struct = struct;
    }

    parse(stream: Stream): Record<string, any> {
        var dst: Record<string, any> = {};
        for (var [key, value] of Object.entries(this.struct)) {
            dst[key] = value(stream, dst);
        }
        return dst;
    }
}