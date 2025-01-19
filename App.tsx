import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
  OpenSans_300Light_Italic,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';
import AppLoading from 'expo-app-loading';
import seedrandom from 'seedrandom';
import Row from './components/Row';
import Column from './components/Column';
import Joker from './components/Joker';
import TileComponent from "./components/Tile";
import Many from './components/Many';

type Color = "red" | "orange" | "green" | "blue" | "yellow" | "empty";

const colorTheme = {
  green: "#6ee67a",
  yellow: "#FFD64F",
  blue: "#80D8FF",
  red: "#f4364f",
  orange: "#fda65a"
}

class Tile {
  x: number;
  y: number;
  checked: boolean;
  color: Color;
  star: boolean;
}

const genTiles = (x: number, y: number): Tile[][] => {
  let lines: Tile[][] = []
  for(let i = 0; i < x; i++) {
    let verticalLine: Tile[] = []
    for(let j = 0; j < y; j++) {
      verticalLine.push({
        x: i,
        y: j,
        checked: false,
        color: "empty",
        star: false
      })
    }
    lines.push(verticalLine);
  }
  return lines;
}


const random = seedrandom("TEST");

const colorTiles = (lines: Tile[][]) => {
  const width = lines[0].length;
  const height = lines.length;
  const tileCount = width * height / 5;
  const colorCount = {red: tileCount, green: tileCount, yellow: tileCount, blue: tileCount, orange: tileCount}
  const starCount = {red: 3, green: 3, yellow: 3, blue: 3, orange: 3}
  const colors = Object.keys(colorCount);
  for(let x = 0; x < width; x++) {
    let requiredColors = Object.keys(colorCount);
    for(let y = 0; y < height; y++) {
      // COLORS
      const fillColors = colors.filter(c => colorCount[c] - (width - x - 1) > 0)
      const availableColors = (requiredColors.length == 0 ? fillColors : requiredColors);
      const randomColor = availableColors[Math.floor(random() * availableColors.length)];
      lines[y][x].color = randomColor as Color;
      colorCount[randomColor] -= 1;
      if(requiredColors.length > 0) {
        requiredColors.splice(requiredColors.indexOf(randomColor), 1);
      }
    }
  }
  return lines;
}

const moveColumnTiles = (lines: Tile[][]) => {
  for(let x = 0; x < lines[0].length; x++) {
    let moved: boolean = true;
    while(moved) {
      moved = false;
      let foundColors: Color[] = [lines[0][x].color];
      for(let y = 1; y < lines.length; y++) {
        const color: Color = lines[y][x].color;
        if(foundColors.includes(color) && lines[y - 1][x].color != color) {
          lines[y][x].color = lines[y - 1][x].color;
          lines[y - 1][x].color = color;
          moved = true;
        }
        foundColors.push(color);
      }
    }
  }
  return lines;
}

const addStars = (lines: Tile[][]) => {
  const width = lines[0].length;
  const height = lines.length;
  const starCount = {red: 3, green: 3, yellow: 3, blue: 3, orange: 3}
  const colors = Object.keys(starCount);
  for(let x = 0; x < width; x++) {
    const possibleStars = colors.filter(c => starCount[c] > 0);
    let randomStar = possibleStars[Math.floor(random() * possibleStars.length)];
    starCount[randomStar] -= 1;
    for(let y = 0; y < height; y++) {
      if(lines[y][x].color == randomStar) {
        lines[y][x].star = true;
        randomStar = "empty";
      }
    }
  }
  return lines;
}

const height = 7;
const width = 15;
const tiles = addStars(moveColumnTiles(colorTiles(genTiles(height, width))));
const centerRow = Math.floor(width / 2);

const calculatePoints = (columns: number, index: number, variant: "first" | "rest") => {
  const table = {
    first: [1,2,2,2,3,3,3,5,5,5,8,8,8,13,13,13], 
    rest: [0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5]
  }
  const points = table[variant][Math.abs(Math.floor(columns / 2) - index)];
  return points;
}

export default function App() {
  const [checkedTiles, setChecked] = useState<[number, number][]>([]);
  const [checkedColumns, setCheckedClm] = useState<number[]>([]);
  const [checkedColors, setCheckedClr] = useState<Color[]>([]);
  const [checkedJokers, setCheckedJkr] = useState<number[]>([]);


  const canCheck = (x:number, y:number) => {
    return x == centerRow ||
           isChecked(x, y) ||
           isChecked(x + 1, y) ||
           isChecked(x - 1, y) ||
           isChecked(x, y + 1) ||
           isChecked(x, y - 1);
  }

  const onTilePress = (x:number, y:number) => {
    if(canCheck(x, y)) {
      checkTile(x, y);
    }
  }

  const checkTile = (x:number, y:number) => {
    if(isChecked(x, y)) {
      tiles[y][x].checked = false;
      setChecked(checkedTiles.filter(([x1, y1]) => !(x == x1 && y == y1)));
    } else {
      tiles[y][x].checked = true;
      setChecked([...checkedTiles, [x, y]]);
    }
  }

  const checkClm = (checked: boolean, x:number) => {
    if(checked) 
      setCheckedClm([...checkedColumns, x])
    else 
      setCheckedClm(checkedColumns.filter(x1 => x1 != x));
  }

  const checkJkr = (x:number) => {
    if(checkedJokers.includes(x)) {
      setCheckedJkr(checkedJokers.filter(x1 => x1 != x));
    } else {
      setCheckedJkr([...checkedJokers, x])
    }
  }

  const checkClr = (x:Color) => {
    if(checkedColors.includes(x)) {
      setCheckedClr(checkedColors.filter(x1 => x1 != x));
    } else {
      setCheckedClr([...checkedColors, x])
    }
  }

  const isChecked = (x:number, y:number) => {
    return x >= 0 && x < width && y >= 0 && y < height && checkedTiles.reduce((b, [x1, y1]) => (x1 == x && y1 == y) || b, false);
  }

  // let [fontsLoaded] = useFonts({
  //   OpenSans_300Light,
  //   OpenSans_400Regular,
  //   OpenSans_500Medium,
  //   OpenSans_600SemiBold,
  //   OpenSans_700Bold,
  //   OpenSans_800ExtraBold,
  //   OpenSans_300Light_Italic,
  //   OpenSans_400Regular_Italic,
  //   OpenSans_500Medium_Italic,
  //   OpenSans_600SemiBold_Italic,
  //   OpenSans_700Bold_Italic,
  //   OpenSans_800ExtraBold_Italic,
  // });

  let jokerScore = 0;
  let colorScore = 0;
  let starScore = 0;
  let columnScore = 0;
  let totalScore = 0;
  {
    jokerScore = 8 - checkedJokers.length;
    let temp = {
      red: checkedColors.includes("red") ? 3 : 5, 
      yellow: checkedColors.includes("yellow") ? 3 : 5, 
      green: checkedColors.includes("green") ? 3 : 5, 
      blue: checkedColors.includes("blue") ? 3 : 5, 
      orange: checkedColors.includes("orange") ? 3 : 5
    };
    for(let x = 0; x < width; x++) {
      let columnPoint = calculatePoints(width, x, checkedColumns.includes(x) ? "rest" : "first")
      for(let y = 0; y < height; y++) {
        const tile = tiles[y][x];
        if(!tile.checked) {
          columnPoint = 0;
          temp[tile.color] = 0;
          if(tile.star) {
            starScore -= 2;
          }
        }
      }
      columnScore += columnPoint;
    }
    colorScore = Object.values(temp).reduce((a, b) => a + b, 0);
    totalScore = jokerScore + colorScore + starScore + columnScore;
  }

  if(!true) {
    return <AppLoading/>
  }
  return (
    <Column style={{flex: 1}}>
      <Row style={{width: "100%"}}>
        <Column>
          <Row style={{marginBottom: 5}}>
              <Many count={width}>
                {(index) => 
                  <TileComponent 
                    key={"top-row-" + index} 
                    type="column" 
                    color={"white"} 
                    content={String.fromCharCode(65 + index)} 
                    center={index == centerRow}
                  />
                }
              </Many>
          </Row>
          {tiles.map((row, y) => (
            <Row key={"row-" + y}>
              {row.map((tile, x) => (
                <Pressable onPress={() => {onTilePress(x, y)}} key={"tile-" + x + "-" + y} style={({pressed}) => [styles.tile , {backgroundColor: colorTheme[tile.color], opacity: pressed ? 0.5 : 1, borderColor: centerRow != x ? "black" : "white"}]}> 
                  <View style={tile.star ? styles.tileStar : styles.tileCircle}/>
                  <Text style={{...{position: "absolute", fontSize: 26, color: "#222222"}, opacity: isChecked(x, y) ? 1 : 0}}>X</Text>
                </Pressable>
              ))}
            </Row>
          ))}
          <Row style={{marginTop: 5}}>
              <Many count={width}>
                {(index) => 
                  <TileComponent key={"point-row2-" + index} onCheck={checked => checkClm(checked, index)} type='column' color={"white"} content={calculatePoints(tiles[0].length, index, "first").toString()}/>
                } 
              </Many>
          </Row>
          <Row>
              <Many count={width}>
                {(index) => 
                  <TileComponent key={"point-row2-" + index} type='column' color={"white"} content={calculatePoints(tiles[0].length, index, "rest").toString()}/>
                }
              </Many>
          </Row>
          <Row style={{backgroundColor: "white", borderRadius: 5, marginBottom: -40, marginTop: 10}}>
            <Many count={8}>
              {(i) => <Joker index={i} checked={checkedJokers.includes(i)} checkJkr={checkJkr}/>}
            </Many>
          </Row>
        </Column>
        <Column>
            {Object.entries(colorTheme).map(([k, v]) => (
              <Row key={"" + k}>
                <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 60, textAlign: "right", marginLeft: 5, marginRight: 5}}></Text>
                <Pressable onPress={() => checkClr(k as Color)} style={({pressed}) => [{...styles.tile , backgroundColor: v, opacity: pressed ? 0.5 : 1}]}>
                  <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "#06060635"}}>5</Text>
                  <Text style={{...{position: "absolute", fontSize: 26, color: "#222222"}, opacity: checkedColors.includes(k as Color) ? 1 : 0}}>X</Text>
                </Pressable>
                <View style={[{...styles.tile , backgroundColor: v, opacity: 1}]}>
                  <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "#06060635"}}>3</Text>
                </View>
              </Row>
            ))}
            <Row>
            <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 60, textAlign: "right", marginLeft: 5, marginRight: 5}}>BONUS</Text>
              <View style={[{...styles.tile , backgroundColor: "white", width: 60}]}>
                <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "black", width: "80%"}}>{"=   "}{colorScore}</Text>
              </View>
            </Row>
            <Row>
              <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 60, textAlign: "right", marginLeft: 5, marginRight: 5}}>A-O</Text>
              <View style={[{...styles.tile , backgroundColor: "white", width: 60}]}>
                <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "green", width: "80%"}}>{"+   "}{columnScore}</Text>
              </View>
            </Row>
            <Row>
              <Row style={{width: 23, height: 23, marginLeft: 7, backgroundColor: "white", borderRadius: 100}}>
                <Text style={{color: "black", fontSize: 20, fontFamily: "OpenSans_800ExtraBold"}}>!</Text>
              </Row>
              <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 30, textAlign: "right", marginLeft: 5, marginRight: 5}}>(+1)</Text>
              <View style={[{...styles.tile , backgroundColor: "white", width: 60}]}>
                <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "green", width: "80%"}}>
                {"+   "}{jokerScore}
                </Text>
              </View>
            </Row>
            <Row>
              <Row style={{width: 25, marginLeft: 5}}>
                <View style={[styles.tileStar, {height: 15, width: 15, backgroundColor: "white", marginLeft: 5}]}/>
              </Row>
              <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 30, textAlign: "right", marginLeft: 5, marginRight: 5}}>(-2)</Text>
              <View style={[{...styles.tile , backgroundColor: "white", width: 60}]}>
                <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "red", width: "80%"}}>{"-   "}{Math.abs(starScore)}</Text>
              </View>
            </Row>
            <Row style={{borderTopWidth: 2, borderStyle: "dashed", borderColor: "white", marginTop: 4, paddingTop: 4}}>
              <Text style={{fontFamily: "OpenSans_700Bold", color: "white", width: 60, textAlign: "right", marginLeft: 5, marginRight: 5}}>TOTAAL</Text>
              <View style={[{...styles.tile , backgroundColor: "white", width: 60}]}>
                <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: "black", width: "80%"}}>{"= "}{totalScore}</Text>
              </View>
            </Row>
        </Column>
      </Row>
    </Column>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 30, 
    height: 30, 
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1.5,
  },
  tileCircle: {
    width: 24, 
    height: 24,
    borderRadius: 50,
    backgroundColor: "#ffffff77"
  },
  tileStar: {
    width: 18,
    height: 18,
    transform: "rotate(45deg)",
    backgroundColor: "#ffffff77",
    borderColor: "white",
    borderWidth: 2,
    borderStyle: "solid"
  },
  checkMark: {
      position: "absolute", 
      fontSize: 26, 
      color: "#222222"
  }
});