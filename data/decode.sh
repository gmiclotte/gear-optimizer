mv level0.decode level0.decode.old

ngupos=$(LANG=C grep -obUaP '\xe7\x84\x11\x55\xe7\x84\x11\x55\xe7\x84\x11\x55\xe7\x84\x11\x55' level0)
hackpos=$(grep "Attack/Defense H" -abom1 level0)
wishpos=$(grep "I wish" -abom1 level0)

echo python decode.py $(echo ${hackpos} ${wishpos} ${ngupos} | grep [0-9]* -o)
python decode.py $(echo ${hackpos} ${wishpos} ${ngupos} | grep [0-9]* -o) > level0.decode
