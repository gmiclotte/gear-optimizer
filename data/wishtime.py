import numpy as np


def ticks2time(ticks):
    ticks = int(ticks)
    d = max(0, ticks // (24 * 60 * 60 * 50))
    ticks -= d * 24 * 60 * 60 * 50
    h = max(0, ticks // (60 * 60 * 50))
    ticks -= h * 60 * 60 * 50
    m = max(0, ticks // (60 * 50))
    ticks -= m * 60 * 50
    s = max(0, ticks // 50)
    ticks -= s * 50
    return (d, h, m, s, ticks)


d, h, m, s, t = 1, 12, 54, 10.6, 0

time = d
time = time * 24 + h
time = time * 60 + m
time = time * 60 + s
time = time * 50 + t

progress = np.float32(0)
ticks = 0

ppt = np.float32(np.float32(1) / np.float32(time))

target = np.float32(1)

while progress < target:
    next = progress + ppt
    if next == progress:
        print(f'early exit at {100 * progress:.2f}%')
        time *= progress
        break
    progress = next
    ticks += 1

print(ticks2time(time))
print(ticks2time(ticks))
print(ticks2time(abs(ticks - time)))
