if (Hls.isSupported()) {
    const video = document.getElementById("videoPlayer");
    const videoSrc = "/videos/menu/menu.m3u8";

    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
    });
} else {
    console.error("HLS non supporté sur ce navigateur.");
}