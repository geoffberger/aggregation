#!/bin/bash

file=../js/data.js
sections=( gargoyle dc quas )
image_num=53
let section_length=${#sections[@]}-1
let last_image_count=$image_num-1

if [ -f $file ]; then
  rm $file
fi

echo "var data = {">>$file

for s in ${sections[@]}; do

  echo "'$s':[">>$file

  for (( i=0; i < $image_num; i++ )); do
    if [ $i != $last_image_count ]; then 
      inner_delim=","
    else
      inner_delim=""
    fi

    #imgs/pcs/gargoyle0.png, imgs/gargoyle0_dist.png, imgs/gargoyle0_angle.png
    image_name=$s$i
    echo "['imgs/pcs/$image_name.png', 'imgs/${image_name}_dist.png', 'imgs/${image_name}_angle.png']$inner_delim">>$file
  done

  if [ $s != ${sections[$section_length]} ]; then 
    outer_delim=","
  else
    outer_delim=""
  fi

  echo "]$outer_delim">>$file

done

echo "};">>$file

