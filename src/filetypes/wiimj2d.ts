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
            mStockItemCount: Types.array(Types.u8(), POWERUP_COUNT)(s),
            mStartKinokoType: Types.array(Types.u8(), WORLD_COUNT)(s),
            mPlayerContinue: Types.array(Types.u8(), PLAYER_COUNT)(s),
            mPlayerCoin: Types.array(Types.s8(), PLAYER_COUNT)(s),
            mPlayerLife: Types.array(Types.u8(), PLAYER_COUNT)(s),
            mPlayerCreateItem: Types.array(Types.u8(), PLAYER_COUNT)(s),
            mPlayerCharacter: Types.array(Types.u8(), PLAYER_COUNT)(s),
            mPlayerPowerup: Types.array(Types.u8(), PLAYER_COUNT)(s),
            mWorldCompletion: Types.array(Types.u8(), WORLD_COUNT)(s),
            mEnemyRevivalCount: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s),
            mUnknown64: Types.u16()(s),
            mStaffRollHighScore: Types.u16()(s),
            mScore: Types.u32()(s),
            mStageCompletion: Types.array(Types.array(Types.u32(), WORLD_COUNT), STAGE_COUNT)(s),
            mOtehonMenuOpen: Types.array(Types.bool(), HINT_MOVIE_COUNT)(s),
            mKinopioCourseNo: Types.array(Types.u8(), WORLD_COUNT)(s),
            mEnemySceneNo: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s),
            mEnemyPosIndex: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s),
            mEnemyWalkDir: Types.array(Types.array(Types.u8(), WORLD_COUNT), AMBUSH_ENEMY_COUNT)(s),
            mDeathCount: Types.array(Types.array(Types.u8(), WORLD_COUNT), STAGE_COUNT)(s),
            mDeathCountSwitch: Types.u8()(s),
            pad: Types.byteArray(0x13)(s),
            mChecksum: Types.u32()(s)
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
