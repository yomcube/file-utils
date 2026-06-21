// Based on EGG::Stream and EGG::RamStream
// https://github.com/kiwi515/ogws/blob/master/include/egg/core/eggStream.h
// https://github.com/vabold/Kinoko/blob/main/source/egg/util/Stream.hh


export enum Endian {
    Big,
    Little
}

export class Stream {
	bytes: Uint8Array;
	dataViewBytes: DataView;
	length: number;
	endian?: Endian;
	idx: number = 0;
	
	constructor(bytes: ArrayBuffer, endian?: Endian) {
		this.bytes = new Uint8Array(bytes);
		this.dataViewBytes = new DataView(bytes);
		this.length = this.bytes.length;
		this.endian = endian;
	}

	#endianToBool(e?: Endian): boolean {
		if (e == undefined) return this.endian == Endian.Little;
		return e == Endian.Little;
	}
	#checkSize(l: number): void {
		if (this.idx + l > this.length) {
			throw new RangeError(`Length check failed.\nidx = ${this.idx}; l = ${l}; length = ${this.length}`);
		}
	}

	/* Common stream functions */
	skip(n: number): number {
		this.#checkSize(n);
		return this.idx += n;
	}
	jump(n: number): number {
		if (n < 0 || n >= this.length) {
			throw new RangeError(`Jump out of bounds.\nn = ${n}; length = ${this.length}`);
		}
		return this.idx = n;
	}
	get index(): number {
		return this.idx;
	}

	/* Read functions */
	read_u8(): number {
		this.#checkSize(1);
		let tmp = this.dataViewBytes.getUint8(this.idx);
		this.idx += 1;
		return tmp;
	}
    read_s8(e?: Endian): number {
		this.#checkSize(1);
		let tmp = this.dataViewBytes.getInt8(this.idx);
		this.idx += 1;
		return tmp;
	}
	read_u16(e?: Endian): number {
		this.#checkSize(2);
		let tmp = this.dataViewBytes.getUint16(this.idx, this.#endianToBool(e));
		this.idx += 2;
		return tmp;
	}
    read_s16(e?: Endian): number {
		this.#checkSize(2);
		let tmp = this.dataViewBytes.getInt16(this.idx, this.#endianToBool(e));
		this.idx += 2;
		return tmp;
	}
	read_u32(e?: Endian): number {
		this.#checkSize(4);
		let tmp = this.dataViewBytes.getUint32(this.idx, this.#endianToBool(e));
		this.idx += 4;
		return tmp;
	}
	read_s32(e?: Endian): number {
		this.#checkSize(4);
		let tmp = this.dataViewBytes.getInt32(this.idx, this.#endianToBool(e));
		this.idx += 4;
		return tmp;
	}
	read_u64_bigint(e?: Endian): bigint {
		this.#checkSize(8);
		let tmp = this.dataViewBytes.getBigUint64(this.idx, this.#endianToBool(e));
		this.idx += 8;
		return tmp;
	}
	read_s64_bigint(e?: Endian): bigint {
		this.#checkSize(8);
		let tmp = this.dataViewBytes.getBigInt64(this.idx, this.#endianToBool(e));
		this.idx += 8;
		return tmp;
	}
    read_f32(e?: Endian): number {
		this.#checkSize(4);
		let tmp = this.dataViewBytes.getFloat32(this.idx, this.#endianToBool(e));
		this.idx += 4;
		return tmp;
	}
    read_f64(e?: Endian): number {
		this.#checkSize(8);
		let tmp = this.dataViewBytes.getFloat64(this.idx, this.#endianToBool(e));
		this.idx += 8;
		return tmp;
	}
	read_string(length: number): string {
		this.#checkSize(length);
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return new TextDecoder().decode(tmp);
	}
	read_string_nt(): string {
		let tmp = [];
		while (true) {
			let val = this.read_u8();
			if (val == 0) break;
			tmp.push(val);
		}
		return new TextDecoder().decode(new Uint8Array(tmp));
	}
	read_bytes(length: number): Uint8Array {
		this.#checkSize(length);
		let tmp = this.bytes.slice(this.idx, this.idx + length);
		this.idx += length;
		return tmp;
	}
}