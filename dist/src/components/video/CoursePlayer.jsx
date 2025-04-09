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
const link_1 = __importDefault(require("next/link"));
const react_2 = require("@iconify/react");
const react_player_1 = __importDefault(require("react-player"));
const screenfull_1 = __importDefault(require("screenfull"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const ProgressCircle_1 = __importDefault(require("@/components/elements/base/progress/ProgressCircle"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const ToggleBox_1 = __importDefault(require("@/components/elements/base/toggle-box/ToggleBox"));
const PlayerControls_1 = __importDefault(require("@/components/video/PlayerControls"));
const next_i18next_1 = require("next-i18next");
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
const CoursePlayer = ({ course, playerRef, playerControlsRef, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    //tabs state
    const [activeTab, setActiveTab] = (0, react_1.useState)("downloads");
    //Course state
    const [activeChapter, setActiveChapter] = (0, react_1.useState)(course.chapters[0]);
    const [activeChallenge, setActiveChallenge] = (0, react_1.useState)(activeChapter.challenges[0]);
    //State for the video player
    const [videoState, setVideoState] = (0, react_1.useState)({
        playing: false,
        muted: false,
        volume: 0.5,
        played: 0,
        seeking: false,
        Buffer: true,
    });
    //Destructuring the properties from the videoState
    const { playing, muted, volume, played, seeking } = videoState;
    //Current played time
    const currentTime = (playerRef === null || playerRef === void 0 ? void 0 : playerRef.current)
        ? playerRef === null || playerRef === void 0 ? void 0 : playerRef.current.getCurrentTime()
        : "00:00";
    //Video duration
    const duration = (playerRef === null || playerRef === void 0 ? void 0 : playerRef.current)
        ? playerRef === null || playerRef === void 0 ? void 0 : playerRef.current.getDuration()
        : "00:00";
    //Formatting the current time and duration
    const formatCurrentTime = formatTime(currentTime);
    const formatDuration = formatTime(duration);
    //Handles Pause/PLay
    function playHandler() {
        setVideoState({
            ...videoState,
            playing: !videoState.playing,
        });
    }
    //Rewinds the video player reducing 5
    function rewindHandler() {
        var _a;
        (_a = playerRef === null || playerRef === void 0 ? void 0 : playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() - 5);
    }
    //FastFowards the video player by adding 10
    function fastFowardHandler() {
        var _a;
        (_a = playerRef === null || playerRef === void 0 ? void 0 : playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() + 10);
    }
    //Handles progress of the video player
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
    //Handles seeking
    function seekHandler(value) {
        var _a;
        setVideoState({ ...videoState, played: value / 100 });
        (_a = playerRef === null || playerRef === void 0 ? void 0 : playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(value / 100);
    }
    //Handles volume change
    function volumeChangeHandler(value) {
        const newVolume = parseFloat(value) / 100;
        setVideoState({
            ...videoState,
            volume: newVolume,
            muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
        });
    }
    //Mutes the video player
    function muteHandler() {
        setVideoState({ ...videoState, muted: !videoState.muted });
    }
    //Handles overlay visibility
    function mouseMoveHandler() {
        playerControlsRef.current.style.visibility = "visible";
        count = 0;
    }
    //Enables fullscreen
    const fullscreenHandler = () => {
        if (screenfull_1.default.isEnabled) {
            screenfull_1.default.request(playerRef.current.wrapper);
        }
    };
    //Find active chapter index
    const activeChapterIndex = course.chapters.findIndex((chapter) => chapter.id === activeChapter.id);
    //Find active challenge index in chapter
    const activeChallengeIndex = activeChapter.challenges.findIndex((challenge) => challenge.id === activeChallenge.id);
    //Select challenge
    const selectChallenge = (challenge) => {
        setActiveChallenge(challenge);
        setActiveChapter(course.chapters[parseInt(challenge.chapterId) - 1]);
    };
    //Select next challenge
    const selectNextChallenge = () => {
        const nextChallengeIndex = activeChallengeIndex + 1;
        const nextChallenge = activeChapter.challenges[nextChallengeIndex];
        const nextChapterIndex = activeChapterIndex + 1;
        const nextChapter = course.chapters[nextChapterIndex];
        if (nextChallengeIndex < activeChapter.challenges.length) {
            setActiveChallenge(nextChallenge);
        }
        else {
            setActiveChapter(nextChapter);
            setActiveChallenge(nextChapter.challenges[0]);
        }
    };
    //Select next chapter
    const selectNextChapter = () => {
        const nextChapterIndex = activeChapterIndex + 1;
        const nextChapter = course.chapters[nextChapterIndex];
        if (nextChapterIndex < course.chapters.length) {
            setActiveChapter(nextChapter);
            setActiveChallenge(nextChapter.challenges[0]);
        }
    };
    return (<div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 ltablet:col-span-8">
        <div>
          <div className="relative w-full overflow-hidden rounded-md pt-[56.25%] [&>div]:absolute [&>div]:left-0 [&>div]:top-0 [&>div]:w-full!" onMouseEnter={mouseMoveHandler}>
            <react_player_1.default ref={playerRef} url={activeChallenge.url} width="100%" height="100%" playing={playing} played={played} muted={muted} volume={volume} onProgress={progressHandler} onEnded={() => {
            setVideoState({
                ...videoState,
                playing: false,
            });
        }}/>
            <PlayerControls_1.default controlRef={playerControlsRef} playing={playing} played={played} onPlayPause={playHandler} onRewind={rewindHandler} onForward={fastFowardHandler} onSeek={(value) => {
            seekHandler(value);
        }} volume={volume} onVolumeChangeHandler={(value) => {
            volumeChangeHandler(value);
        }} mute={muted} onMute={muteHandler} duration={formatDuration} currentTime={formatCurrentTime} onFullscreen={fullscreenHandler} title={activeChapter.title} subtitle={`Chapter ${activeChapter.id} - E0${activeChallengeIndex + 1}`} onNext={selectNextChallenge}/>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-muted-200 py-6 dark:border-muted-800">
          <div className="mb-6 md:mb-0">
            <p className="text-sm uppercase text-muted-500 dark:text-muted-100">
              {t("Chapter")}{" "}
              {activeChapter.id} - E0{activeChallengeIndex + 1}
            </p>
            <h2 className="text-xl font-medium capitalize tracking-wide text-muted-800 dark:text-muted-100">
              {activeChallenge.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip_1.Tooltip content={t("Like video")} position="top">
              <IconButton_1.default color="danger" variant="pastel">
                <react_2.Icon icon="pepicons-pencil:heart-filled" className="h-5 w-5"/>
              </IconButton_1.default>
            </Tooltip_1.Tooltip>
            <Tooltip_1.Tooltip content={t("Share video")} position="top">
              <IconButton_1.default color="contrast">
                <react_2.Icon icon="majesticons:share" className="h-5 w-5"/>
              </IconButton_1.default>
            </Tooltip_1.Tooltip>
            <Tooltip_1.Tooltip content={t("Contact")} position="top">
              <IconButton_1.default color="contrast">
                <react_2.Icon icon="fluent:mail-20-filled" className="h-5 w-5"/>
              </IconButton_1.default>
            </Tooltip_1.Tooltip>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-muted-200 py-6 dark:border-muted-800">
          <div className="flex items-center gap-2">
            <Avatar_1.default src={course.author.picture} size="sm"/>
            <div>
              <p className="text-xs text-muted-500 dark:text-muted-100">
                {t("Author")}
              </p>
              <h2 className="text-base font-medium tracking-wide text-muted-800 dark:text-muted-100">
                {course.author.name}
              </h2>
            </div>
          </div>
          <div>
            <Button_1.default color="muted" variant="pastel" onClick={selectNextChapter}>
              <span>{t("Next Chapter")}</span>
              <react_2.Icon icon="iconamoon:player-right-fill" className="h-4 w-4"/>
            </Button_1.default>
          </div>
        </div>
        <div className="border-b border-muted-200 py-6 dark:border-muted-800">
          <div>
            <h2 className="mb-3 text-base font-medium capitalize tracking-wide text-muted-800 dark:text-muted-100">
              {t("Challenge description")}
            </h2>
            <p className="max-w-2xl text-sm leading-snug text-muted-500 dark:text-muted-100">
              {activeChallenge.description}
            </p>
          </div>
        </div>
        <div className="flex gap-8 border-b border-muted-200 dark:border-muted-800">
          <button type="button" className={`border-b-2 pb-3 pt-4 text-sm
              ${activeTab === "downloads"
            ? "border-primary-500 text-muted-800 dark:text-muted-100"
            : "border-transparent text-muted-400 hover:text-muted-600 dark:text-muted-500 dark:hover:text-muted-300"}
            `} onClick={() => {
            setActiveTab("downloads");
        }}>
            {t("Downloads")}
          </button>
          <button type="button" className={`border-b-2 pb-3 pt-4 text-sm
              ${activeTab === "comments"
            ? "border-primary-500 text-muted-800 dark:text-muted-100"
            : "border-transparent text-muted-400 hover:text-muted-600 dark:text-muted-500 dark:hover:text-muted-300"}
            `} onClick={() => {
            setActiveTab("comments");
        }}>
            {t("Comments")}
          </button>
          <button type="button" className={`border-b-2 pb-3 pt-4 text-sm
              ${activeTab === "reviews"
            ? "border-primary-500 text-muted-800 dark:text-muted-100"
            : "border-transparent text-muted-400 hover:text-muted-600 dark:text-muted-500 dark:hover:text-muted-300"}
            `} onClick={() => {
            setActiveTab("reviews");
        }}>
            {t("Reviews")}
          </button>
        </div>
        <div className="relative mt-8">
          {activeTab === "downloads" ? (<div>
              <div className="mx-auto mb-4 w-full max-w-4xl space-y-10 rounded-sm pb-8">
                <div className="grid gap-8 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
                      {t("Free downloads")}
                    </h3>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400 md:max-w-[190px]">
                      {t("Content that you can immediately download for free")}
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <div className="flex max-w-sm flex-col divide-y divide-muted-200 dark:divide-muted-800">
                      <div className="flex flex-col divide-y divide-muted-200 dark:divide-muted-800">
                        {course.downloads.free.map((download) => (<div key={download.id} className="relative">
                            <div className="flex items-center gap-2 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800">
                              {download.type === "file" ? (<react_2.Icon icon="ph:file-text" className="h-5 w-5 text-primary-500"/>) : ("")}
                              {download.type === "repository" ? (<react_2.Icon icon="fa6-brands:github" className="h-4 w-4 text-muted-900 dark:text-muted-100"/>) : ("")}
                              <div>
                                <p>{download.title}</p>
                                {download.type === "file" ? (<p className="text-xs text-muted-400">
                                    {t("File \u00B7")}{" "}
                                    {download.size}
                                  </p>) : ("")}
                                {download.type === "repository" ? (<p className="text-xs text-muted-400">
                                    {t("Github repository")}
                                  </p>) : ("")}
                              </div>
                              {download.type === "file" ? (<Button_1.default type="button" size="sm" shape="full" className="ms-auto">
                                  <react_2.Icon icon="lucide:arrow-down" className="h-3 w-3"/>
                                  <span>{t("Download")}</span>
                                </Button_1.default>) : ("")}
                              {download.type === "repository" ? (<ButtonLink_1.default href={download.url} type="button" size="sm" shape="full" className="ms-auto">
                                  <span>{t("Access")}</span>
                                  <react_2.Icon icon="lucide:arrow-right" className="h-3 w-3"/>
                                </ButtonLink_1.default>) : ("")}
                            </div>
                          </div>))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
                      {t("Premium downloads")}
                    </h3>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400 md:max-w-[190px]">
                      {t("Content that is only available for subscribed users")}
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <div className="flex max-w-sm flex-col divide-y divide-muted-200 dark:divide-muted-800">
                      {course.downloads.premium.map((download) => (<div key={download.id} className="relative">
                          <div className="flex items-center gap-2 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800">
                            {download.type === "file" ? (<react_2.Icon icon="ph:file-text" className="h-5 w-5 text-primary-500"/>) : ("")}
                            {download.type === "repository" ? (<react_2.Icon icon="fa6-brands:github" className="h-4 w-4 text-muted-900 dark:text-muted-100"/>) : ("")}
                            <div>
                              <p className="text-muted-700 dark:text-muted-100">
                                {download.title}
                              </p>
                              {download.type === "file" ? (<p className="text-xs text-muted-400">
                                  {t("File \u00B7")}{" "}
                                  {download.size}
                                </p>) : ("")}
                              {download.type === "repository" ? (<p className="text-xs text-muted-400">
                                  {t("Github repository")}
                                </p>) : ("")}
                            </div>
                            {download.type === "file" ? (<Button_1.default type="button" size="sm" shape="full" className="ms-auto">
                                <react_2.Icon icon="ph:lock-fill" className="h-3 w-3"/>
                                <span>{t("Download")}</span>
                              </Button_1.default>) : ("")}
                            {download.type === "repository" ? (<ButtonLink_1.default href={download.url} type="button" size="sm" shape="full" className="ms-auto">
                                <span>{t("Access")}</span>
                                <react_2.Icon icon="ph:lock-fill" className="h-3 w-3"/>
                              </ButtonLink_1.default>) : ("")}
                          </div>
                        </div>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>) : ("")}

          {activeTab === "comments" ? (<div>
              <div className="mx-auto mb-4 w-full max-w-4xl space-y-10 rounded-sm pb-8">
                <div className="grid gap-4 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
                      {course.comments.length}{" "}
                      {t("Entr")}{" "}
                      {course.comments.length > 1 ? "ies" : "y"}
                    </h3>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400 md:max-w-[190px]">
                      {t("Subscribed user comments")}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <div className="space-y-8">
                      {course.comments.map((comment) => (<div key={comment.id} className="flex w-full">
                          <div className="me-3 hidden shrink-0 md:block">
                            <Avatar_1.default size="sm" src={comment.user.picture}/>{" "}
                          </div>
                          <Card_1.default color="contrast" className="flex-1 px-4 py-2 leading-relaxed sm:px-6 sm:py-4">
                            <h5 className="space-x-2">
                              <span className="font-medium text-muted-800 dark:text-muted-100">
                                {comment.user.name}
                              </span>
                              <span className="text-xs text-muted-400">
                                {comment.user.date}
                              </span>
                            </h5>
                            <p className="text-sm text-muted-500 dark:text-muted-400">
                              {comment.user.content}
                            </p>
                            <div className="mt-2 flex w-full items-center justify-start text-sm">
                              <div className="flex items-center justify-center gap-3 font-medium text-muted-500 dark:text-muted-400">
                                <button type="button" className="flex items-center underline-offset-4 hover:text-primary-500 hover:underline">
                                  <span>{t("Like")}</span>
                                </button>
                                <small className="flex h-full items-center justify-center">
                                  {t("bull")}
                                </small>
                                <button type="button" className="flex items-center underline-offset-4 hover:text-primary-500 hover:underline">
                                  <span>{t("Reply")}</span>
                                </button>
                              </div>
                            </div>
                            <div className="mt-6 space-y-4 pb-2">
                              <div className="flex">
                                <div className="me-3 hidden shrink-0 md:block">
                                  <Avatar_1.default size="xs" src={comment.author.picture}/>
                                </div>
                                <Card_1.default color="muted" className="flex-1 px-4 py-2 leading-relaxed sm:px-6 sm:py-4">
                                  <h5 className="space-x-2">
                                    <span className="font-medium text-muted-800 dark:text-muted-100">
                                      {comment.author.name}
                                    </span>
                                    <span className="text-xs text-muted-400">
                                      {comment.author.date}
                                    </span>
                                  </h5>
                                  <p className="text-xs text-muted-500 dark:text-muted-400 sm:text-sm">
                                    {comment.author.content}
                                  </p>
                                </Card_1.default>
                              </div>
                            </div>
                          </Card_1.default>
                        </div>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>) : ("")}

          {activeTab === "reviews" ? (<div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {course.reviews.map((review) => (<Card_1.default key={review.id} color="contrast" className="p-8">
                    <div className="flex gap-1">
                      <react_2.Icon icon="uiw:star-on" className={`h-4 w-4 ${review.rating >= 1
                    ? "text-yellow-400"
                    : "text-muted-300 dark:text-muted-700"}`}/>
                      <react_2.Icon icon="uiw:star-on" className={`h-4 w-4 ${review.rating >= 2
                    ? "text-yellow-400"
                    : "text-muted-300 dark:text-muted-700"}`}/>
                      <react_2.Icon icon="uiw:star-on" className={`h-4 w-4 ${review.rating >= 3
                    ? "text-yellow-400"
                    : "text-muted-300 dark:text-muted-700"}`}/>
                      <react_2.Icon icon="uiw:star-on" className={`h-4 w-4 ${review.rating >= 4
                    ? "text-yellow-400"
                    : "text-muted-300 dark:text-muted-700"}`}/>
                      <react_2.Icon icon="uiw:star-on" className={`h-4 w-4 ${review.rating === 5
                    ? "text-yellow-400"
                    : "text-muted-300 dark:text-muted-700"}`}/>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-400">
                      {review.date}
                    </p>
                    <div className="mt-6 flex items-center space-x-1 text-muted-400">
                      <p className="text-sm">{review.course}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-muted-800 dark:text-muted-100">
                        {review.title}
                      </h3>
                      <p className="text-sm leading-5 text-muted-500 dark:text-muted-400">
                        {review.content}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center space-x-2">
                      <div className="flex shrink-0 rounded-full border border-muted-200">
                        <Avatar_1.default src={review.user.picture} size="xs"/>
                      </div>
                      <div>
                        <span className="block text-sm font-medium leading-5 text-muted-800 dark:text-muted-100">
                          {review.user.name}
                        </span>
                        <span className="block text-xs text-muted-400">
                          {review.user.role}
                        </span>
                      </div>
                    </div>
                  </Card_1.default>))}
              </div>
            </div>) : ("")}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="flex flex-col gap-6">
          <Card_1.default color="contrast" className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <Tag_1.default color="success" variant="pastel" className="capitalize">
                {course.level}
              </Tag_1.default>
              <link_1.default href="#" className="group flex items-center gap-2 text-muted-400 underline-offset-4 transition-colors duration-300 hover:text-primary-500 hover:underline">
                <react_2.Icon icon="lucide:arrow-left" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"/>
                <span className="text-sm">{t("Back")}</span>
              </link_1.default>
            </div>
            <h2 className="mb-4 text-xl text-muted-800 dark:text-muted-100">
              {course.title}
            </h2>
            <p className="text-sm text-muted-500 dark:text-muted-100">
              {course.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium uppercase leading-none text-muted-400">
                  {course.chapters.length}{" "}
                  {t("Chapters")}
                </span>
                <span className="px-2">·</span>
                <span className="text-sm font-medium text-primary-500">
                  {course.duration}
                </span>
              </div>
              <div>
                <Button_1.default color="primary">
                  {t("Enroll for")}{" "}
                  <span className="ps-2 text-base font-semibold">$89</span>
                </Button_1.default>
              </div>
            </div>
          </Card_1.default>
          {course.chapters.map((chapter) => (<ToggleBox_1.default key={chapter.id} color="contrast" spaced open={chapter === activeChapter ? true : false} header={<div>
                  <p className="text-xs uppercase leading-none text-muted-500 dark:text-muted-100">
                    {t("Chapter")}
                    {chapter.id}
                  </p>
                  <h2 className="text-base font-medium capitalize tracking-wide text-muted-800 dark:text-muted-100">
                    {chapter.title}
                  </h2>
                </div>}>
              <div className="flex items-center justify-between">
                <div>
                  <Tag_1.default color={chapter.pricing === "free" ? "primary" : "warning"} variant="pastel" className="capitalize">
                    {chapter.pricing === "free" ? "Free" : "Premium"}
                  </Tag_1.default>
                </div>
                <div className="flex items-center gap-1 text-muted-400">
                  <react_2.Icon icon="mdi:timer" className="h-4 w-4"/>
                  <span className="text-sm">{chapter.duration}</span>
                </div>
              </div>
              <div className="mt-4">
                <ul className="space-y-4 pb-4 ps-2">
                  {chapter.challenges.map((challenge) => (<li key={challenge.id} className="flex items-center gap-3">
                      <div className="relative">
                        <button type="button" className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300
                            ${challenge === activeChallenge &&
                    !challenge.completed
                    ? "border-primary-500 bg-primary-500 text-white hover:enabled:bg-primary-600"
                    : "border-primary-500/10 bg-primary-500/10 text-primary-500"}
                          `} onClick={() => {
                    challenge === activeChallenge ? playHandler() : "";
                }}>
                          {challenge === activeChallenge && playing ? (<react_2.Icon icon="iconamoon:player-pause-fill" className="pointer-events-none h-4 w-4"/>) : (<react_2.Icon icon="iconamoon:player-play-fill" className="pointer-events-none h-4 w-4"/>)}
                          {challenge === activeChallenge ? (<span className="pointer-events-none absolute left-1/2 top-1/2 z-10 block -translate-x-1/2 -translate-y-1/2">
                              <ProgressCircle_1.default size={65} thickness={1} value={played * 100} color="primary"/>
                            </span>) : ("")}
                        </button>
                      </div>
                      <button type="button" className={`block text-start text-sm transition-colors duration-300
                            ${challenge === activeChallenge
                    ? "font-semibold text-primary-500"
                    : "text-muted-500 hover:text-muted-700 dark:text-muted-400 dark:hover:text-muted-100"}
                          `} onClick={() => {
                    selectChallenge(challenge);
                }}>
                        {challenge.title}
                      </button>
                      <div className="ms-auto">
                        <span className="text-xs text-muted-400">
                          {challenge.duration}
                        </span>
                      </div>
                    </li>))}
                </ul>
              </div>
            </ToggleBox_1.default>))}
        </div>
      </div>
    </div>);
};
exports.default = CoursePlayer;
