import { Stream, Endian } from "./stream.js"

export type BaseType = (s: Stream) => any;

export function u8() {
    return ((s: Stream) => {
        return s.read_u8();
    });
}
export function s8() {
    return ((s: Stream) => {
        return s.read_s8();
    });
}
export function u16(e?: Endian) {
    return ((s: Stream) => {
        return s.read_u16(e);
    });
}
export function s16(e?: Endian) {
    return ((s: Stream) => {
        return s.read_s16(e);
    });
}
export function u32(e?: Endian) {
    return ((s: Stream) => {
        return s.read_u32(e);
    });
}
export function s32(e?: Endian) {
    return ((s: Stream) => {
        return s.read_s32(e);
    });
}
export function u64(e?: Endian) {
    return ((s: Stream) => {
        return s.read_u64_bigint(e);
    });
}
export function s64(e?: Endian) {
    return ((s: Stream) => {
        return s.read_s64_bigint(e);
    });
}

export function f32(e?: Endian) {
    return ((s: Stream) => {
        return s.read_f32(e);
    });
}
export function f64(e?: Endian) {
    return ((s: Stream) => {
        return s.read_f32(e);
    });
}

export function str(length: number) {
    return ((s: Stream) => {
        return s.read_string(length);
    });
}
export function byteArray(length: number) {
    return ((s: Stream) => {
        return s.read_bytes(length);
    });
}

export function bool() {
    return ((s: Stream) => {
        return s.read_u8() != 0;
    });
}

export function array(type: BaseType, length: number) {
    return ((s: Stream) => {
        let tmp = [];
        for (let i = 0; i < length; i++) {
            tmp.push(type(s));
        }
        return tmp;
    });
}
