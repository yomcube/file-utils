// https://github.com/NSMBW-Community/NSMBW-Decomp/blob/master/include/game/bases/d_mj2d_data.hpp
// 

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export const WORLD_COUNT = 10;
export const STAGE_COUNT = 40;
export const AMBUSH_ENEMY_COUNT = 4;
export const SAVE_SLOT_COUNT = 3;
export const PLAYER_COUNT = 4;

export string[] PLAYERS_a { "Mario", "Luigi", "Yellow Toad", "Blue Toad" };

export function dMj2dHeader_c() {
    return ((s) => {
        return {
            mMagic: Types.u32()(s),
            mRevision: Types.u16()(s),
            mLastSelectedFile: Types.u8()(s),
            mUnknown7: Types.u8()(s),
            mPlayCountFreeMode: Types.array(
                Types.array(Types.u16(), WORLD_COUNT),
                STAGE_COUNT
            )(s),
            mPlayCountCoinBattle: Types.array(
                Types.array(Types.u16(), WORLD_COUNT),
                STAGE_COUNT
            )(s),
            mMultiWorldOpenFlag: Types.u16()(s),
            mUnknown69A: Types.u16()(s),
            mChecksum: Types.u32()(s)
        };
    });
}
export function dMj2dGame_c() {
    return ((s) => {
        return {
            mRevision: Types.u16()(s),
            mGameCompletion: Types.u8()(s),
            mCurrentWorld: Types.u8()(s),
            mCurrentSubWorld: Types.u8()(s),
            mCurrentPathNode: Types.u8()(s),
            mIbaraNow: Types.u8()(s),
            mSwitchOn: Types.u8()(s),
            mUnknown8: Types.u8()(s),
            
        };
    });
}

export class Wiimj2dFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Little);
        
        this.structure = new Structure({
            header: dMj2dHeader_c(),

        });

        this.parsed = this.structure.parse(this.stream);
    }
}
