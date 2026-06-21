// https://github.com/NSMBW-Community/NSMBW-Decomp/blob/master/include/game/bases/d_mj2d_data.hpp

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export const WORLD_COUNT = 10;
export const STAGE_COUNT = 40;
export const AMBUSH_ENEMY_COUNT = 4;
export const SAVE_SLOT_COUNT = 3;
export const PLAYER_COUNT = 4;
export const POWERUP_COUNT = 7;
export const HINT_MOVIE_COUNT = 7;

export const PLAYERS_str_a: string[] = [ "Mario", "Luigi", "Yellow Toad", "Blue Toad" ];

export function dMj2dHeader_c() {
    return ((s: Stream, ctx: any) => {
        return {
            mMagic: Types.u32()(s, ctx),
            mRevision: Types.u16()(s, ctx),
            mLastSelectedFile: Types.u8()(s, ctx),
            mUnknown7: Types.u8()(s, ctx),
            mPlayCountFreeMode: Types.array(
                Types.array(Types.u16(), WORLD_COUNT),
                STAGE_COUNT
            )(s, ctx),
            mPlayCountCoinBattle: Types.array(
                Types.array(Types.u16(), WORLD_COUNT),
                STAGE_COUNT
            )(s, ctx),
            mMultiWorldOpenFlag: Types.u16()(s, ctx),
            mUnknown69A: Types.u16()(s, ctx),
            mChecksum: Types.u32()(s, ctx)
        };
    });
}
export function dMj2dGame_c() {
    return ((s: Stream, ctx: any) => {
        return {
            mRevision: Types.u16()(s, ctx),
            mGameCompletion: Types.u8()(s, ctx),
            mCurrentWorld: Types.u8()(s, ctx),
            mCurrentSubWorld: Types.u8()(s, ctx),
            mCurrentPathNode: Types.u8()(s, ctx),
            mIbaraNow: Types.u8()(s, ctx),
            mSwitchOn: Types.u8()(s, ctx),
            mUnknown8: Types.u8()(s, ctx),
            mStockItemCount: Types.array(Types.u8(), POWERUP_COUNT)(s, ctx),
            mStartKinokoType: Types.array(Types.u8(), WORLD_COUNT)(s, ctx),
            mPlayerContinue: Types.array(Types.u8(), PLAYER_COUNT)(s, ctx),
            mPlayerCoin: Types.array(Types.s8(), PLAYER_COUNT)(s, ctx),
            mPlayerLife: Types.array(Types.u8(), PLAYER_COUNT)(s, ctx),
            mPlayerCreateItem: Types.array(Types.u8(), PLAYER_COUNT)(s, ctx),
            mPlayerCharacter: Types.array(Types.u8(), PLAYER_COUNT)(s, ctx),
            mPlayerPowerup: Types.array(Types.u8(), PLAYER_COUNT)(s, ctx),
            mWorldCompletion: Types.array(Types.u8(), WORLD_COUNT)(s, ctx),
            mEnemyRevivalCount: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s, ctx),
            mUnknown64: Types.u16()(s, ctx),
            mStaffRollHighScore: Types.u16()(s, ctx),
            mScore: Types.u32()(s, ctx),
            mStageCompletion: Types.array(Types.array(Types.u32(), WORLD_COUNT), STAGE_COUNT)(s, ctx),
            mOtehonMenuOpen: Types.array(Types.bool(), HINT_MOVIE_COUNT)(s, ctx),
            mKinopioCourseNo: Types.array(Types.u8(), WORLD_COUNT)(s, ctx),
            mEnemySceneNo: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s, ctx),
            mEnemyPosIndex: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s, ctx),
            mEnemyWalkDir: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s, ctx),
            mDeathCount: Types.array(Types.array(Types.u8(), WORLD_COUNT), STAGE_COUNT)(s, ctx),
            mDeathCountSwitch: Types.u8()(s, ctx),
            pad: Types.byteArray(0x13)(s, ctx),
            mChecksum: Types.u32()(s, ctx)
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
            saves: Types.array(dMj2dGame_c(), 3),
            quickSaves: Types.array(dMj2dGame_c(), 3),
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
