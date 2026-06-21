// https://wiki.tockdom.com/wiki/Rksys.dat

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";
import { RKGTimeStructType } from "./rkg.js";

export function RKPD() {
    return ((s: Stream, ctx: any) => {
        return {
            signature: Types.u32()(s, ctx),
            personalBestFlags: Types.u32()(s, ctx),
            downloadedGhostFlags: Types.u32()(s, ctx),
            normalStaffGhostFlags: Types.u32()(s, ctx),
            expertStaffGhostFlags: Types.u32()(s, ctx),
            miiName: Types.byteArray(20)(s, ctx),
            miiAvatarId: Types.u32()(s, ctx),
            miiClientId: Types.u32()(s, ctx),
            completionFlagsA: Types.u32()(s, ctx),
            completionFlagsB: Types.u32()(s, ctx),
            unknown0: Types.byteArray(8)(s, ctx),
            dwcSize: Types.u32()(s, ctx),
            dwcPseudoUserId: Types.array(Types.u32(), 2)(s, ctx),
            dwcPseudoPlayerId: Types.u32()(s, ctx),
            dwcAuthenticUserId: Types.array(Types.u32(), 2)(s, ctx),
            dwcAuthenticPlayerId: Types.u32()(s, ctx),
            dwcPlayerProfileId: Types.u32()(s, ctx),
            dwcUnknownFlags: Types.u32()(s, ctx),
            dwcGameId: Types.str(4)(s, ctx),
            dwcUnknown0: Types.byteArray(20)(s, ctx),
            dwcCRC: Types.u32()(s, ctx),
            rulesSingleplayer: Types.u32()(s, ctx),
            rulesMultiplayer: Types.u32()(s, ctx),
            offlineWinsVS: Types.s32()(s, ctx),
            offlineLossesVS: Types.s32()(s, ctx),
            offlineWinsBattle: Types.s32()(s, ctx),
            offlineLossesBattle: Types.s32()(s, ctx),
            wfcWinsVS: Types.s32()(s, ctx),
            wfcLossesVS: Types.s32()(s, ctx),
            wfcWinsBattle: Types.s32()(s, ctx),
            wfcLossesBattle: Types.s32()(s, ctx),
            ghostBattleWins: Types.s32()(s, ctx),
            ghostBattleLosses: Types.s32()(s, ctx),
            raceRating: Types.u16()(s, ctx),
            battleRating: Types.u16()(s, ctx),
            totalRaceCount: Types.s32()(s, ctx),
            totalBattleCount: Types.s32()(s, ctx),
            racesWithWheel: Types.s32()(s, ctx),
            battlesWithWheel: Types.s32()(s, ctx),
            distanceTravelled: Types.f32()(s, ctx),
            ghostChallengesSent: Types.s32()(s, ctx),
            ghostChallengesReceived: Types.s32()(s, ctx),
            itemHitsDelivered: Types.s32()(s, ctx),
            itemHitsReceived: Types.s32()(s, ctx),
            tricksPerformed: Types.s32()(s, ctx),
            timesFirstPlace: Types.s32()(s, ctx),
            distanceTravelledInFirst: Types.s32()(s, ctx),
            distanceTravelledOnVS: Types.s32()(s, ctx),
            competitionsEntered: Types.u16()(s, ctx),
            defaultDrift: Types.u8()(s, ctx),
            unknown1: Types.u8()(s, ctx),
            
            racesCompletedCharArray: Types.array(Types.u16(), 25)(s, ctx),
            racesCompletedVehicleArray: Types.array(Types.u16(), 36)(s, ctx),
            racesCompletedCourseArray: Types.array(Types.u16(), 32)(s, ctx),
            racesCompletedArenaArray: Types.array(Types.u16(), 10)(s, ctx),
            
            padding0: Types.byteArray(6)(s, ctx),
            cupData50cc: Types.array(RKPDCup(), 8)(s, ctx),
            cupData100cc: Types.array(RKPDCup(), 8)(s, ctx),
            cupData150cc: Types.array(RKPDCup(), 8)(s, ctx),
            cupDataMirror: Types.array(RKPDCup(), 8)(s, ctx),

            timeTrialLeaderboardRanks: Types.array(RKPDTimeTrialLeaderboardEntry(), 5)(s, ctx),
            timeTrialLeaderboardFlap: RKPDTimeTrialLeaderboardEntry()(s, ctx),
            competitionLeaderboard: Types.array(RKPDCompetitionLeaderboardEntry(), 6)(s, ctx),

            friendDataMain: Types.array(RKPDFriendBlockMain(), 30)(s, ctx),
            friendDataSecondary: Types.array(RKPDFriendBlockSecondary(), 30)(s, ctx),
        }
    });
}
export function RKPDCup() {
    return ((s: Stream, ctx: any) => {
        return {
            unknownStringData: Types.byteArray(0x4C)(s, ctx),
            unknown0: Types.byteArray(3)(s, ctx),
            trophy: Types.u8()(s, ctx),
            unknown1: Types.u8()(s, ctx),
            rank: Types.u8()(s, ctx),
            completed: Types.bool()(s, ctx),
            unknown2: Types.byteArray(0xD)(s, ctx)
        };
    });
}
export function RKPDTimeTrialLeaderboardEntry() {
    return ((s: Stream, ctx: any) => {
        return {
            mii: Types.byteArray(0x4A)(s, ctx),
            miiCRC: Types.u16()(s, ctx),
            time: RKGTimeStructType()(s, ctx),
            vehicle: Types.u8()(s, ctx),
            characterAndEnabled: Types.u8()(s, ctx),
            controller: Types.u8()(s, ctx),
            unknown0: Types.byteArray(14)(s, ctx),
        };
    });
}
export function RKPDCompetitionLeaderboardEntry() {
    return ((s: Stream, ctx: any) => {
        return {
            time: RKGTimeStructType()(s, ctx),
            vehicle: Types.u8()(s, ctx),
            characterAndValid: Types.u8()(s, ctx),
            controller: Types.u8()(s, ctx),
            unknown0: Types.u16()(s, ctx)
        };
    });
}
export function RKPDFriendBlockMain() {
    return ((s: Stream, ctx: any) => {
        return {
            unknown0: Types.u32()(s, ctx),
            pid: Types.u32()(s, ctx),
            unknown1: Types.u32()(s, ctx),
            unknown2: Types.u32()(s, ctx),
            unknown3: Types.u16()(s, ctx),
            losses: Types.u16()(s, ctx),
            wins: Types.u16()(s, ctx),
            raceRating: Types.u16()(s, ctx),
            battleRating: Types.u16()(s, ctx),
            miiData: Types.byteArray(0x4A)(s, ctx),
            unknown4: Types.u32()(s, ctx),
            countryId: Types.u8()(s, ctx),
            regionId: Types.u8()(s, ctx),
            unknown5: Types.u16()(s, ctx),
            coordinates: Types.array(Types.u16(), 2)(s, ctx),
            unknown6: Types.byteArray(0x150)(s, ctx)
        };
    });
}
export function RKPDFriendBlockSecondary() {
    return ((s: Stream, ctx: any) => {
        return {
            unknown0: Types.u16()(s, ctx),
            unknown1: Types.u8()(s, ctx),
            unknown2: Types.u8()(s, ctx),
            pid: Types.u32()(s, ctx),
            unknown3: Types.u32()(s, ctx),
        };
    });
}

export function RKGD() {
    return ((s: Stream, ctx: any) => {
        return {
            signature: Types.u32()(s, ctx),
            settings: Types.u32()(s, ctx),
            competitionInfoArray: Types.array(RKGDCompetitionInfo(), 10)(s, ctx),
            rankingTimeTrialChampions: Types.array(RKGDTimeTrialChampions(), 32)(s, ctx),
            rankingCompetitionChampions: RKGDCompetitionChampions()(s, ctx),
            specialGhostIdList: Types.array(Types.u32(), 10)(s, ctx),
            lastGhostRaceDate: Types.u16()(s, ctx),
            regionId: Types.u16()(s, ctx)
        };
    });
}
export function RKGDCompetitionInfo() {
    return ((s: Stream, ctx: any) => {
        return {
            id: Types.u32()(s, ctx),
            worldwideRankings: RKGDCompetitionRankingData()(s, ctx),
            regionalRankings: RKGDCompetitionRankingData()(s, ctx)
        };
    });
}
export function RKGDCompetitionRankingData() {
    return ((s: Stream, ctx: any) => {
        return {
            miiMultiplier: Types.u32()(s, ctx),
            rankTimeLimit: Types.u32()(s, ctx),
            championTime: Types.u32()(s, ctx), // Probably RKGTime
            miiData: Types.byteArray(0x4A)(s, ctx),
            miiCRC: Types.u16()(s, ctx),
            unknown0: Types.u8()(s, ctx),
            character: Types.u8()(s, ctx),
            vehicle: Types.u8()(s, ctx),
            unknown1: Types.u8()(s, ctx),
            unknown2: Types.byteArray(100)(s, ctx),
            unknown3: Types.u32()(s, ctx),
            unknown4: Types.byteArray(28)(s, ctx),
        };
    });
}
export function RKGDTimeTrialChampions() {
    return ((s: Stream, ctx: any) => {
        return {
            regionalChampion: RKGDTimeTrialChampionsEntry()(s, ctx),
            worldwideChampion: RKGDTimeTrialChampionsEntry()(s, ctx),
        };
    });
}
export function RKGDTimeTrialChampionsEntry() {
    return ((s: Stream, ctx: any) => {
        return {
            finishTime: Types.u32()(s, ctx), // Probably RKGTime
            miiDataWithChecksum: Types.byteArray(0x4C)(s, ctx)
        };
    });
}
export function RKGDCompetitionChampions() {
    return ((s: Stream, ctx: any) => {
        return {
            regionalChampion: RKGDCompetitionChampionsEntry()(s, ctx),
            worldwideChampion: RKGDCompetitionChampionsEntry()(s, ctx),
        };
    });
}
export function RKGDCompetitionChampionsEntry() {
    return ((s: Stream, ctx: any) => {
        return {
            finishTime: Types.u32()(s, ctx), // Probably RKGTime
            unknown0: Types.u32()(s, ctx),
            miiDataWithChecksum: Types.byteArray(0x4C)(s, ctx)
        };
    });
}

export class RksysFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Big);
        
        this.structure = new Structure({
            signature: Types.u32(),
            version: Types.u32(),
            profiles: Types.array(RKPD(), 4),
            globalData: RKGD(),
            field_0x26B0C: Types.byteArray(0x14F0),
            crc32: Types.u32(),
            ghostData: Types.array(
                Types.array(Types.byteArray(0x2800), 32), 4 // TODO: use RKG file structure
            )
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
