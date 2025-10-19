// https://wiki.tockdom.com/wiki/Rksys.dat

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";
import { RKGTimeStructType } from "./rkg.js";

export function RKPD() {
    return ((s) => {
        return {
            signature: Types.u32()(s),
            personalBestFlags: Types.u32()(s),
            downloadedGhostFlags: Types.u32()(s),
            normalStaffGhostFlags: Types.u32()(s),
            expertStaffGhostFlags: Types.u32()(s),
            miiName: Types.byteArray(20)(s),
            miiAvatarId: Types.u32()(s),
            miiClientId: Types.u32()(s),
            completionFlagsA: Types.u32()(s),
            completionFlagsB: Types.u32()(s),
            unknown0: Types.byteArray(8)(s),
            dwcSize: Types.u32()(s),
            dwcPseudoUserId: Types.array(Types.u32(), 2)(s),
            dwcPseudoPlayerId: Types.u32()(s),
            dwcAuthenticUserId: Types.array(Types.u32(), 2)(s),
            dwcAuthenticPlayerId: Types.u32()(s),
            dwcPlayerProfileId: Types.u32()(s),
            dwcUnknownFlags: Types.u32()(s),
            dwcGameId: Types.str(4)(s),
            dwcUnknown0: Types.byteArray(20)(s),
            dwcCRC: Types.u32()(s),
            rulesSingleplayer: Types.u32()(s),
            rulesMultiplayer: Types.u32()(s),
            offlineWinsVS: Types.s32()(s),
            offlineLossesVS: Types.s32()(s),
            offlineWinsBattle: Types.s32()(s),
            offlineLossesBattle: Types.s32()(s),
            wfcWinsVS: Types.s32()(s),
            wfcLossesVS: Types.s32()(s),
            wfcWinsBattle: Types.s32()(s),
            wfcLossesBattle: Types.s32()(s),
            ghostBattleWins: Types.s32()(s),
            ghostBattleLosses: Types.s32()(s),
            raceRating: Types.u16()(s),
            battleRating: Types.u16()(s),
            totalRaceCount: Types.s32()(s),
            totalBattleCount: Types.s32()(s),
            racesWithWheel: Types.s32()(s),
            battlesWithWheel: Types.s32()(s),
            distanceTravelled: Types.f32()(s),
            ghostChallengesSent: Types.s32()(s),
            ghostChallengesReceived: Types.s32()(s),
            itemHitsDelivered: Types.s32()(s),
            itemHitsReceived: Types.s32()(s),
            tricksPerformed: Types.s32()(s),
            timesFirstPlace: Types.s32()(s),
            distanceTravelledInFirst: Types.s32()(s),
            distanceTravelledOnVS: Types.s32()(s),
            competitionsEntered: Types.u16()(s),
            defaultDrift: Types.u8()(s),
            unknown1: Types.u8()(s),
            
            racesCompletedCharArray: Types.array(Types.u16(), 25)(s),
            racesCompletedVehicleArray: Types.array(Types.u16(), 36)(s),
            racesCompletedCourseArray: Types.array(Types.u16(), 32)(s),
            racesCompletedArenaArray: Types.array(Types.u16(), 10)(s),
            
            padding0: Types.byteArray(6)(s),
            cupData50cc: Types.array(RKPDCup(), 8)(s),
            cupData100cc: Types.array(RKPDCup(), 8)(s),
            cupData150cc: Types.array(RKPDCup(), 8)(s),
            cupDataMirror: Types.array(RKPDCup(), 8)(s),

            timeTrialLeaderboardRanks: Types.array(RKPDTimeTrialLeaderboardEntry(), 5)(s),
            timeTrialLeaderboardFlap: RKPDTimeTrialLeaderboardEntry()(s),
            competitionLeaderboard: Types.array(RKPDCompetitionLeaderboardEntry(), 6)(s),

            friendDataMain: Types.array(RKPDFriendBlockMain(), 30)(s),
            friendDataSecondary: Types.array(RKPDFriendBlockSecondary(), 30)(s),
        }
    });
}
export function RKPDCup() {
    return ((s) => {
        return {
            unknownStringData: Types.byteArray(0x4C)(s),
            unknown0: Types.byteArray(3)(s),
            trophy: Types.u8()(s),
            unknown1: Types.u8()(s),
            rank: Types.u8()(s),
            completed: Types.bool()(s),
            unknown2: Types.byteArray(0xD)(s)
        };
    });
}
export function RKPDTimeTrialLeaderboardEntry() {
    return ((s) => {
        return {
            mii: Types.byteArray(0x4A)(s),
            miiCRC: Types.u16()(s),
            time: RKGTimeStructType()(s),
            vehicle: Types.u8()(s),
            characterAndEnabled: Types.u8()(s),
            controller: Types.u8()(s),
            unknown0: Types.byteArray(14)(s),
        };
    });
}
export function RKPDCompetitionLeaderboardEntry() {
    return ((s) => {
        return {
            time: RKGTimeStructType()(s),
            vehicle: Types.u8()(s),
            characterAndValid: Types.u8()(s),
            controller: Types.u8()(s),
            unknown0: Types.u16()(s)
        };
    });
}
export function RKPDFriendBlockMain() {
    return ((s) => {
        return {
            unknown0: Types.u32()(s),
            pid: Types.u32()(s),
            unknown1: Types.u32()(s),
            unknown2: Types.u32()(s),
            unknown3: Types.u16()(s),
            losses: Types.u16()(s),
            wins: Types.u16()(s),
            raceRating: Types.u16()(s),
            battleRating: Types.u16()(s),
            miiData: Types.byteArray(0x4A)(s),
            unknown4: Types.u32()(s),
            countryId: Types.u8()(s),
            regionId: Types.u8()(s),
            unknown5: Types.u16()(s),
            coordinates: Types.array(Types.u16(), 2)(s),
            unknown6: Types.byteArray(0x150)(s)
        };
    });
}
export function RKPDFriendBlockSecondary() {
    return ((s) => {
        return {
            unknown0: Types.u16()(s),
            unknown1: Types.u8()(s),
            unknown2: Types.u8()(s),
            pid: Types.u32()(s),
            unknown3: Types.u32()(s),
        };
    });
}

export function RKGD() {
    return ((s) => {
        return {
            signature: Types.u32()(s),
            settings: Types.u32()(s),
            competitionInfoArray: Types.array(RKGDCompetitionInfo(), 10)(s),
            rankingTimeTrialChampions: Types.array(RKGDTimeTrialChampions(), 32)(s),
            rankingCompetitionChampions: RKGDCompetitionChampions()(s),
            specialGhostIdList: Types.array(Types.u32(), 10)(s),
            lastGhostRaceDate: Types.u16()(s),
            regionId: Types.u16()(s)
        };
    });
}
export function RKGDCompetitionInfo() {
    return ((s) => {
        return {
            id: Types.u32()(s),
            worldwideRankings: RKGDCompetitionRankingData()(s),
            regionalRankings: RKGDCompetitionRankingData()(s)
        };
    });
}
export function RKGDCompetitionRankingData() {
    return ((s) => {
        return {
            miiMultiplier: Types.u32()(s),
            rankTimeLimit: Types.u32()(s),
            championTime: Types.u32()(s), // Probably RKGTime
            miiData: Types.byteArray(0x4A)(s),
            miiCRC: Types.u16()(s),
            unknown0: Types.u8()(s),
            character: Types.u8()(s),
            vehicle: Types.u8()(s),
            unknown1: Types.u8()(s),
            unknown2: Types.byteArray(100)(s),
            unknown3: Types.u32()(s),
            unknown4: Types.byteArray(28)(s),
        };
    });
}
export function RKGDTimeTrialChampions() {
    return ((s) => {
        return {
            regionalChampion: RKGDTimeTrialChampionsEntry()(s),
            worldwideChampion: RKGDTimeTrialChampionsEntry()(s),
        };
    });
}
export function RKGDTimeTrialChampionsEntry() {
    return ((s) => {
        return {
            finishTime: Types.u32()(s), // Probably RKGTime
            miiDataWithChecksum: Types.byteArray(0x4C)(s)
        };
    });
}
export function RKGDCompetitionChampions() {
    return ((s) => {
        return {
            regionalChampion: RKGDCompetitionChampionsEntry()(s),
            worldwideChampion: RKGDCompetitionChampionsEntry()(s),
        };
    });
}
export function RKGDCompetitionChampionsEntry() {
    return ((s) => {
        return {
            finishTime: Types.u32()(s), // Probably RKGTime
            unknown0: Types.u32()(s),
            miiDataWithChecksum: Types.byteArray(0x4C)(s)
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
