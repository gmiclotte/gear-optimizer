mv level0.decode level0.decode.old

hackpos=$(grep "Attack/Defense H" -abom1 level0)
wishpos=$(grep "I wish" -abom1 level0)

echo python decode.py $(echo ${hackpos} ${wishpos} | grep [0-9]* -o)
python decode.py $(echo ${hackpos} ${wishpos} | grep [0-9]* -o) > level0.decode
