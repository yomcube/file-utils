// https://github.com/dolphin-emu/dolphin/blob/a2913abeb9b25f73d54f1bd179ce877fa5531a77/Source/Core/Core/Movie.h#L80

import { IFile } from "../ifile.js";
import { Stream, Endian } from "../stream.js";
import { Structure, Types } from "../structure.js";

export class DTMFile implements IFile {
    stream: Stream;
    structure: Structure;
    parsed: Record<string, any>;

    constructor(bytes: Uint8Array) {
        this.stream = new Stream(bytes.buffer as ArrayBuffer, Endian.Little);
        
        this.structure = new Structure({
            filetype: Types.u32(), // Unique Identifier (always "DTM"0x1A)

            gameID: Types.str(6), // The Game ID
            bWii: Types.bool(),   // Wii game

            // Controllers plugged in (from least to most significant,
            // the bits are GC controllers 1-4 and Wiimotes 1-4)
            controllers: Types.u8(),
            
            bFromSaveState: Types.bool(), // false indicates that the recording started from bootup, true for savestate
            frameCount: Types.u64(),      // Number of frames in the recording
            inputCount: Types.u64(),      // Number of input frames in recording
            lagCount: Types.u64(),        // Number of lag frames in the recording
            uniqueID: Types.u64(),        // (not implemented) A Unique ID comprised of: md5(time + Game ID)
            numRerecords: Types.u32(),    // Number of rerecords/'cuts' of this TAS
            author: Types.str(32),        // Author's name (encoded in UTF-8)

            videoBackend: Types.str(16),  // UTF-8 representation of the video backend
            audioEmulator: Types.str(16), // UTF-8 representation of the audio emulator
            md5: Types.byteArray(16),     // MD5 of game iso

            recordingStartTime: Types.u64(), // seconds since 1970 that recording started (used for RTC)

            bSaveConfig: Types.bool(), // Loads the settings below on startup if true
            bSkipIdle: Types.bool(),
            bDualCore: Types.bool(),
            bProgressive: Types.bool(),
            bDSPHLE: Types.bool(),
            bFastDiscSpeed: Types.bool(),
            CPUCore: Types.u8(),  // Uses the values of PowerPC::CPUCore
            bEFBAccessEnable: Types.bool(),
            bEFBCopyEnable: Types.bool(),
            bSkipEFBCopyToRam: Types.bool(),
            bEFBCopyCacheEnable: Types.bool(),
            bEFBEmulateFormatChanges: Types.bool(),
            bImmediateXFB: Types.bool(),
            bSkipXFBCopyToRam: Types.bool(),
            memcards: Types.u8(),     // Memcards inserted (from least to most significant, the bits are slot A and B)
            bClearSave: Types.bool(), // Create a new memory card when playing back a movie if true
            bongos: Types.u8(),       // Bongos plugged in (from least to most significant, the bits are ports 1-4)
            bSyncGPU: Types.bool(),
            bNetPlay: Types.bool(),
            bPAL60: Types.bool(),
            language: Types.u8(),
            reserved3: Types.u8(),
            bFollowBranch: Types.bool(),
            bUseFMA: Types.bool(),
            GBAControllers: Types.u8(),    // GBA Controllers plugged in (the bits are ports 1-4)
            bWidescreen: Types.bool(),     // true indicates SYSCONF aspect ratio is 16:9, false for 4:3
            countryCode: Types.u8(),       // SYSCONF country code
            reserved: Types.byteArray(5),  // Padding for any new config options
            discChange: Types.str(40),     // Name of iso file to switch to, for two disc games.
            revision: Types.byteArray(20), // Git hash
            DSPiromHash: Types.u32(),
            DSPcoefHash: Types.u32(),
            tickCount: Types.u64(), // Number of ticks in the recording
            reserved2: Types.byteArray(11) // Make heading 256 bytes, just because we can
        });

        this.parsed = this.structure.parse(this.stream);
    }
}
