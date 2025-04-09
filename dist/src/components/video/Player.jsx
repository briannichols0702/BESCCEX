"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_player_1 = __importDefault(require("react-player"));
const screenfull_1 = __importDefault(require("screenfull"));
const PlayerControls_1 = __importDefault(require("@/components/video/PlayerControls"));
const formatTime = (time) => {
    //formarting duration of video
    if (isNaN(time)) {
        return "00:00";
    }
    const date = new Date(time * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    if (hours) {
        //if video has hours
        return `${hours}:${minutes.toString().padStart(2, "0")} `;
    }
    else
        return `${minutes}:${seconds}`;
};
let count = 0;
const Player = ({ playState = false, playerRef, playerControlsRef, url, title, subtitle, onNext, }) => {
    //State for the video player
    const [videoState, setVideoState] = (0, react_1.useState)({
        playing: playState,
        muted: false,
        volume: 0.5,
        played: 0,
        seeking: false,
        Buffer: true,
    });
    //Destructuring the properties from the videoState
    const { playing, muted, volume, played, seeking } = videoState;
    const currentTime = (playerRef === null || playerRef === void 0 ? void 0 : playerRef.current)
        ? playerRef === null || playerRef === void 0 ? void 0 : playerRef.current.getCurrentTime()
        : "00:00";
    const duration = (playerRef === null || playerRef === void 0 ? void 0 : playerRef.current)
        ? playerRef === null || playerRef === void 0 ? void 0 : playerRef.current.getDuration()
        : "00:00";
    const formatCurrentTime = formatTime(currentTime);
    const formatDuration = formatTime(duration);
    function playHandler() {
        //Handles Pause/PLay
        setVideoState({
            ...videoState,
            playing: !videoState.playing,
        });
    }
    function rewindHandler() {
        var _a;
        //Rewinds the video player reducing 5
        (_a = playerRef === null || playerRef === void 0 ? void 0 : playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() - 5);
    }
    function fastFowardHandler() {
        var _a;
        //FastFowards the video player by adding 10
        (_a = playerRef === null || playerRef === void 0 ? void 0 : playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() + 10);
    }
    function progressHandler(state) {
        if (count > 2) {
            // toggling player control container
            playerControlsRef.current.style.visibility = "hidden";
        }
        else if (playerControlsRef.current.style.visibility === "visible") {
            count += 1;
        }
        if (!seeking) {
            setVideoState({ ...videoState, ...state });
        }
    }
    function seekHandler(value) {
        setVideoState({ ...videoState, played: parseFloat(value) / 100 });
    }
    function volumeChangeHandler(value) {
        const newVolume = parseFloat(value) / 100;
        setVideoState({
            ...videoState,
            volume: newVolume,
            muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
        });
    }
    function muteHandler() {
        //Mutes the video player
        setVideoState({ ...videoState, muted: !videoState.muted });
    }
    function mouseMoveHandler() {
        playerControlsRef.current.style.visibility = "visible";
        count = 0;
    }
    const fullscreenHandler = () => {
        if (screenfull_1.default.isEnabled) {
            screenfull_1.default.request(playerRef.current.wrapper);
        }
    };
    return (<div className="relative w-full overflow-hidden rounded-md pt-[56.25%] [&>div]:absolute [&>div]:left-0 [&>div]:top-0 [&>div]:w-full!" onMouseDown={mouseMoveHandler}>
      <react_player_1.default ref={playerRef} url={url} width="100%" height="100%" playing={playing} played={played} muted={muted} volume={volume} onProgress={progressHandler}/>
      <PlayerControls_1.default controlRef={playerControlsRef} playing={playing} played={played} onPlayPause={playHandler} onRewind={rewindHandler} onForward={fastFowardHandler} onSeek={(value) => {
            seekHandler(value);
        }} volume={volume} onVolumeChangeHandler={(value) => {
            volumeChangeHandler(value);
        }} mute={muted} onMute={muteHandler} duration={formatDuration} currentTime={formatCurrentTime} onFullscreen={fullscreenHandler} title={title} subtitle={subtitle} onNext={() => {
            onNext === null || onNext === void 0 ? void 0 : onNext();
        }}/>
    </div>);
};
exports.default = Player;
