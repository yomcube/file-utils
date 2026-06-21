import { Stream, Endian } from "./stream.js"

export type BaseType = (s: Stream, ctx: any) => any;

export function u8(): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_u8();
    });
}
export function s8(): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_s8();
    });
}
export function u16(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_u16(e);
    });
}
export function s16(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_s16(e);
    });
}
export function u32(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_u32(e);
    });
}
export function s32(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_s32(e);
    });
}
export function u64(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_u64_bigint(e);
    });
}
export function s64(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_s64_bigint(e);
    });
}

export function f32(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_f32(e);
    });
}
export function f64(e?: Endian): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_f32(e);
    });
}

export function str(length: number): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_string(length);
    });
}
export function str_nt(): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_string_nt();
    });
}
export function byteArray(length: number): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_bytes(length);
    });
}

export function bool(): BaseType {
    return ((s: Stream, ctx: any) => {
        return s.read_u8() != 0;
    });
}

export function array(typ: BaseType, length: number): BaseType {
    return ((s: Stream, ctx: any) => {
        let tmp = [];
        for (let i = 0; i < length; i++) {
            tmp.push(typ(s, ctx));
        }
        return tmp;
    });
}

export function t_if(func: (ctx: any) => boolean, typ: BaseType): BaseType {
    return ((s: Stream, ctx: any) => {
        if (func(ctx)) return typ(s, ctx);
        return null;
    });
}
