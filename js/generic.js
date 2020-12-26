
const getRandomCard = (array) => {
    return array[Math.floor(Math.random() * (array.length-1))]
}

const makePhrase = (atribute,lang) => {
    if(lang == "eng"){
      if (atribute == "bald" || atribute == "male") return `Is (s)he ${words[atribute][lang]}?`
      else return `Does (s)he have ${words[atribute][lang]}?`
    }
    else{
      if (atribute == "bald" || atribute == "male") return `Ele(a) é ${words[atribute][lang]}?`
      else return `Ele(a) tem ${words[atribute][lang]}?`
    }

    
}
const getRandomBest = array =>{
    if (array.length>1){
      let lucky = Math.floor(Math.random() *array.length);
      return array[lucky];
    }
    else return array[0]
}
const setTotal = (dic) => {
    Object.keys(dic["total"]).forEach(atr => dic["total"][atr] = 0)
    for(var key in dic){  // find Total occurences of each atribute
      if (key == "total") break  
      for (var atribute in dic[key]){
        if (dic[key][atribute])
          dic["total"][atribute]+= 1
      }
    }
    for(var atr in dic["total"])
        if(dic["total"][atr] == 0) delete dic["total"][atr] 
  

}
let logDictionary = (dict,msg = "DICIONARY") => {
  console.log(`** ${msg} **`)
  console.log(dict)
}
const getFrequency = (atribute,cards) => {
    let k = cards["total"][atribute]
    let n = Object.keys(cards).length - 1
    return (((k*k)+((n-k)*(n-k)))/n).toFixed(5)
  }

const getDifference = (atribute,cards) => { // no use. same results as getFrequency()
  let k = cards["total"][atribute]
  let n = Object.keys(cards).length - 1
  return (Math.abs(k - (n/2))).toFixed(3)
}

// const getGINI = (atribute,numPeople) => {
//   let totalBald = people["total"][atribute]
//   let i1 = (totalBald/numPeople)*(totalBald/numPeople)
//   let i0 = ((numPeople-totalBald)/numPeople)*((numPeople-totalBald)/numPeople)
//   let res = (1-i1-i0).toFixed(6)
//   return res // max decimal places = 6
// }
  