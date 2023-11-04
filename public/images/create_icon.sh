

ffmpeg -i $1 -vf "scale=16:16" icon16.png
ffmpeg -i $1 -vf "scale=32:32" icon32.png
ffmpeg -i $1 -vf "scale=48:48" icon48.png
ffmpeg -i $1 -vf "scale=128:128" icon128.png

