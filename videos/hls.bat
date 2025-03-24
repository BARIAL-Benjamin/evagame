ffmpeg -i ".\menu-hd.mp4"
    -filter_complex
        "[0:v]split=4[v1][v2][v3][v4];
        [v1]scale=w=1920:h=1080[v1out];
        [v2]scale=w=1280:h=720[v2out];
        [v3]scale=w=854:h=480[v3out];
        [v4]scale=w=640:h=360[v4out]"
    -map "[v1out]" -b:v:0 500k -maxrate 500k -bufsize 1000k
    -map "[v2out]" -b:v:1 750k -maxrate 750k -bufsize 1500k
    -map "[v3out]" -b:v:2 1000k -maxrate 1000k -bufsize 2000k
    -map "[v4out]" -b:v:3 3000k -maxrate 3000k -bufsize 6000k
    -hls_time 4
    -hls_playlist_type vod
    -hls_segment_type mpegts
    -hls_flags independent_segments
    -hls_segment_filename "menu/stream_%v/segment_%02d.ts"
    -master_pl_name "menu.m3u8"
    -var_stream_map "v:0 v:1 v:2 v:3"
    -f hls "menu/stream_%v/index.m3u8"