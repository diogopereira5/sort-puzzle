import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const cores = ['#583d72', '#fc8621', '#045762', '#ff4646', '#a3d2ca', '#21209c', '#532e1c'];

  const [nivel, setNivel] = useState(1);
  const [partida, setPartida] = useState(1);
  const [posicoes, setPosicoes] = useState([]);
  const [select, setSelect] = useState();

  useEffect(() => {

    getData();

  }, [partida, nivel]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@partida')
      // console.log(value)
      if (value !== null) {
        await setPartida(Number.parseInt(value));
        var nivelcalc = (Math.ceil(Number.parseInt(value) / 10) * 10) / 10;
        if (nivelcalc > 6) {
          nivelcalc = 6;
        }
        await setNivel(nivelcalc);
      }

      generateGamer();
    } catch (e) {
      // error reading value
    }
  }


  async function generateGamer() {

    //nivel

    var startCores = [];
    var startTubos = [];

    for (let i = 0; i <= nivel; i++) {
      for (let ii = 0; ii < 4; ii++) {
        startCores.push(i);
      }
    }

    startCores = shuffle(startCores);

    for (let i = 0; i < startCores.length / 4; i++) {
      var data = [];
      for (let ii = i * 4; ii < (i * 4) + 4; ii++) {
        data.push(startCores[ii])
      }
      startTubos.push(data);
    }

    if (nivel >= 4) {
      startTubos.push([]);
      startTubos.push([]);
    } else {
      startTubos.push([]);
    }

    await setPosicoes(startTubos);

  }

  async function click(index, item) {


    if (item.length === 0 && !select) {
      return
    }

    if (select === index) {
      setSelect();
      return
    }

    if (!select) {
      setSelect(index);
      return
    }

    console.log(select);

    var sai = (posicoes[select - 1][(posicoes[select - 1].length) - 1]);

    if (item.length != 4) {
      var data = posicoes;

      if (sai != data[index - 1][data[index - 1].length - 1] && data[index - 1].length != 0) {
        setSelect();
        return
      }

      data[select - 1].splice(data[select - 1].length - 1);//enviando
      data[index - 1].push(sai);//coletando

      var stop = false;
      for (let i = data[select - 1].length - 1; i >= 0; i--) {
        var proximo = data[select - 1][i];
        // if(proximo === sai){
        //   console.log(''+i+' - '+sai);
        // }
        if (!stop) {
          if (sai === proximo) {
            if (data[index - 1].length < 4) {
              data[select - 1].splice(i);//enviando
              data[index - 1].push(sai);//coletando
            }
          } else {
            stop = true;
          }
        }
      }

      setPosicoes(data);

      setSelect();

    } else {
      setSelect();
    }

    saveGame();

  }

  async function saveGame() {

    var gamer = 0;
    for (let i = 0; i < posicoes.length; i++) {
      var value = 0;
      var cont = 0;
      for (let ii = 0; ii < posicoes[i].length; ii++) {
        if (ii == 0) {
          value = posicoes[i][ii];
        } else {
          cont++;
        }

        if (cont == 3) {
          gamer++;
        }
      }
      cont = 0;
      value = 0;
    }

    // console.log(gamer);

    try {
      var value = partida + 1;
      await AsyncStorage.setItem('@partida', value);
    } catch (e) {
      console.log(e);
    }

    if (gamer == (nivel + 1)) {
      setPartida(partida + 1);
      generateGamer();
    }

  }

  function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.level}>Level {partida}</Text>
        <Text style={[styles.level, { fontSize: 14 }]}>Dificuldade {nivel}</Text>
        <TouchableOpacity style={{ marginVertical: 10, }} onPress={() => generateGamer()}>
          <Icon name="retweet" size={30} color={"#fff"} />
        </TouchableOpacity>
      </View>

      {/* <View style={{
        flex: 1, alignItems: 'center',
        justifyContent: 'center',
      }}> */}
        <View style={styles.content}>
          {posicoes.length > 0 ?
            <>
              {posicoes.map((item, index) => {
                index = index + 1;
                if (index < 6)
                  return (
                    <TouchableOpacity key={index} onPress={() => click(index, item)}>
                      <View style={styles.tubo}>
                        {item.map((item, index) => {
                          if (index === 0) {
                            return (
                              <View key={index} style={[styles.liquidoFirst, { backgroundColor: cores[item] }]} />
                            )
                          } else {
                            return (
                              <View key={index} style={[styles.liquido, { backgroundColor: cores[item] }]} />
                            )
                          }
                        })}
                      </View>
                      {select === index ? <View style={{ marginBottom: 50, }} /> : null}
                    </TouchableOpacity>
                  )
              })}

            </>
            : null}
        </View>

        <View style={styles.content}>
          {posicoes.length > 0 ?
            <>
              {posicoes.map((item, index) => {
                index = index + 1;
                if (index >= 6)
                  return (
                    <TouchableOpacity key={index} onPress={() => click(index, item)}>
                      <View style={styles.tubo}>
                        {item.map((item, index) => {
                          if (index === 0) {
                            return (
                              <View key={index} style={[styles.liquidoFirst, { backgroundColor: cores[item] }]} />
                            )
                          } else {
                            return (
                              <View key={index} style={[styles.liquido, { backgroundColor: cores[item] }]} />
                            )
                          }
                        })}
                      </View>
                      {select === index ? <View style={{ marginBottom: 50, }} /> : null}
                    </TouchableOpacity>
                  )
              })}

            </>
            : null}
        </View>

      {/* </View> */}

      {/* <View style={styles.points}>
          <Text style={styles.level}>0 Pontos</Text>
        </View> */}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#344055aa',
  },

  header: {
    // flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  level: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },

  column: {
    flexDirection: "row",
  },

  tubo: {
    borderColor: '#fff',
    borderWidth: 2,
    height: Dimensions.get('window').height / 4,
    width: Dimensions.get('window').width / 10,
    marginHorizontal: 10,
    paddingBottom: 2,
    maxWidth: 60,
    maxHeight: 500,

    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column-reverse',

    borderTopWidth: 4,
    borderBottomEndRadius: 200 / 2,
    borderBottomStartRadius: 200 / 2,
  },

  liquido: {
    height: '23%',
    width: '94%',
  },

  liquidoFirst: {
    height: '23%',
    width: '94%',
    borderBottomEndRadius: 200 / 2,
    borderBottomStartRadius: 200 / 2,
  },

  points: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
