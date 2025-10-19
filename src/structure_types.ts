import { Endian } from "./stream.js"

export type BaseType = (stream) => object;

export function u8() {
    return ((stream) => {
        return stream.read_u8();
    });
}
export function s8() {
    return ((stream) => {
        return stream.read_s8();
    });
}
export function u16(e?: Endian) {
    return ((stream) => {
        return stream.read_u16(e);
    });
}
export function s16(e?: Endian) {
    return ((stream) => {
        return stream.read_s16(e);
    });
}
export function u32(e?: Endian) {
    return ((stream) => {
        return stream.read_u32(e);
    });
}
export function s32(e?: Endian) {
    return ((stream) => {
        return stream.read_s32(e);
    });
}
export function u64(e?: Endian) {
    return ((stream) => {
        return stream.read_u64_bigint(e);
    });
}
export function s64(e?: Endian) {
    return ((stream) => {
        return stream.read_s64_bigint(e);
    });
}

export function f32(e?: Endian) {
    return ((stream) => {
        return stream.read_f32(e);
    });
}
export function f64(e?: Endian) {
    return ((stream) => {
        return stream.read_f32(e);
    });
}

export function str(length: number) {
    return ((stream) => {
        return stream.read_string(length);
    });
}
export function byteArray(length: number) {
    return ((stream) => {
        return stream.read_bytes(length);
    });
}

export function bool() {
    return ((stream) => {
        return stream.read_u8() != 0;
    });
}

export function array(type: BaseType, length: number) {
    return ((stream) => {
        let tmp = [];
        for (let i = 0; i < length; i++) {
            tmp.push(type(stream));
        }
        return tmp;
    });
}
