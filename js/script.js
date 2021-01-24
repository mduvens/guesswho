const cardsNum = document.querySelectorAll('.slot').length;
const cardAssigned = document.getElementById('card-assigned');
const btnRematch = document.getElementById('btn-rematch');

const getRand = limit => Math.round(Math.random() * limit);

// cardAssigned.className = 'card card--assigned card-' + getRand(cardsNum);

// btnRematch.onclick = () => {
//   cardAssigned.className = 'card card--assigned card-' + getRand(cardsNum);
// };

//*************************M*************************/
const answerYes = document.getElementById("answerYES")
const answerNo = document.getElementById("answerNO")
const questionsHTML = document.getElementById("questions")
const answersHTML = document.getElementById("answers")
const endRematch = document.getElementById("endRematch")
const gameoverHTML = document.getElementById("gameover")
const endMessageHMTL = document.getElementById("endMessage")
const questionAskedHMTL = document.getElementById("questionAsked")
const guessedPersonHTML = document.getElementById("guesswho")
const myAnswersHMTL = document.getElementById("myAnswers")
const selectQuestionHMTL = document.getElementById("selectQuestion")
const finalDivHMTL = document.getElementById("finalDiv")
const myGuessHMTL = document.getElementById("myGuess")
const introHTML = document.getElementById("intro")
const factsKnownHTML = document.getElementById("factsKnown")
const btnShowPGuess = document.getElementById("btnShowPGuess")
const playerGuessHTML = document.getElementById("playerGuess")
const whoItWasHTML = document.getElementById("whoItWas")
const soundLogoHTML = document.getElementById("soundLogo")
const playerWinsHTML = document.getElementById("playerWins")
const myWinsHTML = document.getElementById("myWins")
const finalNOHTML = document.getElementById("finalNO")
const playerCheatHTML = document.getElementById("playerCheat")
const btnLanguageHTML =  document.getElementById("btnLanguage")
const testLANGHTML = document.querySelectorAll(".testLANG")
const btnRestartHTML =  document.getElementById("btnRestart")
const finalRestartHTML =  document.getElementById("finalRestart")
const cancelRestartHTML =  document.getElementById("cancelRestart")

cancelRestartHTML.onclick = () => {
  finalRestartHTML.style.display ="none"
}
btnRestartHTML.onclick = () => {
  finalRestartHTML.style.display ="block"
}


let language = "eng"

let boolMyAnswers = true;
let playerWins = 0, myWins= 0;
let audioVolume = 0.4
// audio (testing)
let audios = []
let music = new Audio("sounds/wiimusic.mp3"); 
music.volume = 0
music.loop = true
let victoryAudio = new Audio("sounds/quizVictory.wav"); // I think wav is already supported  by all modern browsers
victoryAudio.volume = audioVolume
audios.push(victoryAudio)
let defeatAudio = new Audio("sounds/defeat.mp3"); 
defeatAudio.volume = audioVolume
audios.push(defeatAudio)
let toggleMusic = () => {
  if(music.volume){
    soundLogoHTML.src ="./img/soundOFF.png"
    music.volume = 0
    // audios.forEach(audio => audio.volume = 0)
  } 
  else{
    if(music.paused) music.play()
    music.volume = 0.3
    soundLogoHTML.src ="./img/soundON.png"
    // audios.forEach(audio => audio.volume = audioVolume)
  } 
} 

let toClean = [questionAskedHMTL, myAnswersHMTL] // test
let toFinalHide = {
  "answers":answersHTML,
  "questions":questionsHTML,
  "facts":factsKnownHTML
}
let frequencies, playerAnswers, myAnswers,
  nPeople, cards, computerCard, possibleAtributes;
let best = {};
let questionValue = null;
let answerValue = null;
let finalAnswerValue = null;
let timevar;
let existvar;
let guessedPerson
let turn = true
let exists = false
let peopleLeft;
let playerCardIndex;
let boolWhoStarts = 1;
let victory = -1
//                          ** LANGUAGE ** (working)
let toggleLanguage = () => {
  if(language == "eng"){
    language = "pt"
    btnLanguageHTML.src = "./img/flagPT.png"
    document.title = "Quem é Quem"
  }
  else{
    btnLanguageHTML.src = "./img/flagEN.png"
    language = "eng"
    document.title = "Guess Who"
  }
  applyLanguage()
}
let applyLanguage = () => {
  createAtributeHTML()
  drawKnownFacts()
  if(testLANGHTML)
    testLANGHTML.forEach(e => {
      e.innerHTML = words[e.id][language]
    })
    myGuessHMTL.innerHTML = `${words["myGuess"][language]} ${finalPerson} ?`
    if(best["atribute"]) questionAskedHMTL.innerHTML = makePhrase(best["atribute"],language)
    
    if(victory>=0){
      if(victory){
        endMessageHMTL.innerHTML = words["endMessageWIN"][language]
        whoItWasHTML.innerHTML = words["goodJob"][language]
      }
      else{
        endMessageHMTL.innerHTML = words["endMessageLOSE"][language]
        whoItWasHTML.innerHTML = `${words["whoItWas"][language]} <b><i>${computerCard}</i></b> `
      }
    }
}


let createAtributeHTML = () => {
  selectQuestionHMTL.length = 1 // clear atributes in case we had more people and choose randomly
  var option, flag 
  for(var key in people["total"]){
    flag = false
    for(var atr in myAnswers){
      if (key == atr){
        flag = true
        break
      }
    }
    if(flag) continue
    var word = words[key][language];
    option = document.createElement("option");
    option.text = `${atributeImages[words[key]["eng"]]} ${word.toUpperCase()}`
    option.value = words[key]["eng"]
    selectQuestionHMTL.add(option)
  }
  
}
let startGame = () => {
  victory = -1
  playerCardIndex = getRand(cardsNum)
  cardAssigned.className = 'card card--assigned card-' + playerCardIndex; // show player assigned card
  activeCards = {}
  frequencies = {}
  playerAnswers = {}
  myAnswers = {}
  possibleAtributes = []
  cards = Object.keys(people)
  finalAnswerValue = null
  nPeople = cards.length - 1
  computerCard = getRandomCard(cards)
  console.log(`MY CARD: ${computerCard}`)
  toClean.forEach(e => e.innerHTML = "")
  guessedPersonHTML.value =""
  guessedPerson = ""
  setTotal(people)
  activeCards = JSON.parse(JSON.stringify(people))  // Deep Copy of an object
  Object.keys(people["total"]).forEach(key => {
    possibleAtributes.push(key)
    // fill possible atributes HTML
  })
  createAtributeHTML()
  showHUD()
  if(boolWhoStarts){
    play(boolWhoStarts)
    boolWhoStarts = 0
  }
  else{
    play(boolWhoStarts)
    boolWhoStarts = 1
  }
    
  
}
let endGame = win => {
  hideHUD()
  finalDivHMTL.style.display = "none"
  playerGuessHTML.style.display ="none"
  if (win) {
    music.pause()
    victoryAudio.play()
    playerWins += 1
    playerWinsHTML.innerHTML = playerWins
    endMessageHMTL.innerHTML = words["endMessageWIN"][language]
    whoItWasHTML.innerHTML = words["goodJob"][language]
    endMessageHMTL.style.color = "#00dd00"

  } else {
    defeatAudio.play()
    music.pause()
    myWins += 1
    myWinsHTML.innerHTML = `${myWins}`
    endMessageHMTL.innerHTML =  words["endMessageLOSE"][language]
    whoItWasHTML.innerHTML = `${words["whoItWas"][language]} <b><i>${computerCard}</i></b> `

    endMessageHMTL.style.color = "red"

  }
  gameoverHTML.style.display = "block"
}
// gets the best question, gets null if there is only 1 person left
let getBestQuestion = () => { 
  frequencies = {}
  let lowest = [ // array for capturing equal frequencies
    ["master", 100]
  ]
  if (Object.keys(activeCards).length > 2) {
    Object.keys(activeCards["total"]).forEach(atrib => { // check the lowest frequency and store in array (in case there is more than one)
      value = frequencies[atrib] = getFrequency(atrib, activeCards);
      value == lowest[0][1] ? lowest.push([atrib, value]) : 0
      if (value < lowest[0][1]) {
        lowest = []
        lowest.push([atrib, value])
      }
    })
    bestAtribute = getRandomBest(lowest)[0]
    return {atribute: bestAtribute, question: makePhrase(bestAtribute,language)}
  }
  else{
    return {atribute: null, question: `${Object.keys(activeCards)}`}
  }
 
}

let getQuestionValue = (value) => {
    questionValue = value
}
let getAnswerValue = (value) => {
      answerValue = value
}
let getFinalAnswerValue = (value) => {
  if(value == "yes")
    finalAnswerValue = value
  else{
    if(cards[playerCardIndex] == finalPerson){ // check if player is lying
      playerCheatHTML.style.display = "block"
      setTimeout( () => {
        playerCheatHTML.style.display = "none"
        console.log("hide")
      },1000)
    }
    else{
      victory = 1
      endGame(victory)
    }
  }
}

// Get player answer and make adjustments to active cards
answerYes.onclick = () => {
  playerAnswers[best["atribute"]] = true
  console.log("** PLAYER ANSWERS **")
  console.log(playerAnswers)
  Object.keys(activeCards).forEach(person => { // removing computer cards after asking questions
    if (!(activeCards[person][best["atribute"]]) && person != "total")
      delete activeCards[person]
  })
  setTotal(activeCards)
  logDictionary(activeCards,"ACTIVE CARDS")
  // console.log(`positive atributes: ${Object.keys(activeCards["total"])}`)

}
answerNo.onclick = () => {
  playerAnswers[best["atribute"]] = false
  console.log(playerAnswers)
  Object.keys(activeCards).forEach(person => { // removing computer cards after asking questions
    if (activeCards[person][best["atribute"]] && person != "total")
      delete activeCards[person]
  })
  setTotal(activeCards)
  logDictionary(activeCards,"ACTIVE CARDS")
  // console.log(`positive atributes: ${Object.keys(activeCards["total"])}`)

}


const hideIntro = () => {
  introHTML.style.display ="none"
  showHUD()
  startGame()

}
const hideHUD = () => {
  Object.keys(toFinalHide).forEach(e => {
    toFinalHide[e].style.display = "none"
  })
}
const showHUD = () => {
  Object.keys(toFinalHide).forEach(e => {
    if((turn && e != "answers") || (!turn && e != "questions")) // show Q or A depending on who is playing
      toFinalHide[e].style.display = "block"
  })
}
const showFinal = () => {
  finalDivHMTL.style.display ="block"
}


// DOM OPS
endRematch.onclick = () => {
  gameoverHTML.style.display = "none"
  music.play()
  startGame()
}

let enableQuestion = () => {
  selectQuestionHMTL.value = ''
  selectQuestionHMTL.length = 1
  createAtributeHTML()
  questionsHTML.style.display = "block"
  answersHTML.style.display = "none"

}
let enableAnswer = () => {
  questionsHTML.style.display = "none"
  answersHTML.style.display = "block"
}

const showPlayerGuess = () => {
  hideHUD()
  guessedPersonHTML.autofocus = true
  playerGuessHTML.style.display = "block"
}
const cancelPlayerGuess = () => {
  showHUD()
  playerGuessHTML.style.display = "none"
  guessedPersonHTML.value = ""

}
let drawKnownFacts = () => {
  myAnswersHMTL.innerHTML = ""
  Object.keys(myAnswers).forEach(ans => {
    if(myAnswers[ans]){
      colorAtr = "#00cc00"
      myAnswersHMTL.innerHTML += `<b style="color:${colorAtr}">${atributeImages[words[ans]["eng"]]}${words[ans][language].toUpperCase()}✔️</b><br>`

    }else{
      colorAtr = "#ff0000"
      myAnswersHMTL.innerHTML += `<b style="color:${colorAtr}">${atributeImages[words[ans]["eng"]]}${words[ans][language].toUpperCase()} ❌</b><br>`
    } 
  })
}
// Check asked question and add the response to the canvas
function checkQuestion(atr) {
  if (atr) {
    let colorAtr;
    myAnswersHMTL.innerHTML = ''
    myAnswers[atr] = people[computerCard][atr] // don't need deep copy
    drawKnownFacts()
    return {
      atribute: atr,
      answer: myAnswers[atr]
    }

  } else return {
    atribute: null,
    answer: null
  }
}
let finalPerson;
let myMove = () => {
  // check how many people are left
  best = getBestQuestion() // get question, gets null if there is only 1 person left
  //wait for answer
  if(best["atribute"] == null){
   
    for(var key in activeCards){
      if(key != "total") finalPerson = key; // get name of person left
    }
    myGuessHMTL.innerHTML = `${words["myGuess"][language]} ${finalPerson} ?`
    hideHUD()
    showFinal()
    timevar = setInterval(() => { // wait for player to confirm our victory (testing)
      if(finalAnswerValue){
        finalDivHMTL.style.display = "none"
        clearInterval(timevar)
        victory = 0
        endGame(victory)
      }
    }, 500) // check 2 times per second
  }
  else{
    stringQuestion = `${best["question"]}`
    questionAskedHMTL.innerHTML = stringQuestion;
    enableAnswer()
    timevar = setInterval(() => {
      if (answerValue) {
          clearInterval(timevar)
          play(1)
        }
    }, 500) 
  }
  
}

//check text input (test)
guessedPersonHTML.onkeyup = (e) => {
  if (e.keyCode === 13) { // Enter key pressed
    if(exists){
      if (computerCard.toUpperCase() == $("#guesswho").val().toUpperCase()){
          victory  = 1
          endGame(victory)
          return
      }else {
        victory = 0
        endGame(victory)
      }
     
    }
    else{
        guessedPersonHTML.value ='Does not exist!'
        guessedPersonHTML.disabled = true
        setTimeout(() => {
          guessedPersonHTML.value = guessedPerson
          guessedPersonHTML.disabled = false
          guessedPersonHTML.focus()

        },1000)
    } 
  }
  else{
    var input = guessedPersonHTML.value //+ String.fromCharCode(e.keyCode) // get live input 
    guessedPerson = input
    console.log(guessedPerson)
  }
}


let checkInput = () => {
      if (playerGuessHTML.style.display == "block"){
        existsvar = setInterval(() => {
          for(var i = 0; i<cards.length; i++){
            if(guessedPerson){
              guessedPersonHTML.value = guessedPersonHTML.value.toUpperCase()
              if (guessedPerson.toUpperCase() == cards[i].toUpperCase()){
                // VERDE
                exists = true
                guessedPersonHTML.style.color = "green"
                playerGuessHTML.style.borderColor = "green"
                break
              }
              else{
                // VERMELHO
                exists = false
                guessedPersonHTML.style.color = "red"
                playerGuessHTML.style.borderColor = "red"

              }
            }
            else playerGuessHTML.style.borderColor = "white"
             
          }
        }, 333)
      }
      else{
        if(existvar) clearInterval(existvar)
      }
}
let playerMove = () => {
  
  enableQuestion()
  timevar = setInterval(() => {
    if (questionValue) {
      checkQuestion(questionValue)
      clearInterval(timevar)
      play(0)
    }
    checkInput()
  
  }, 500)
  
  
}
// play function
let play = (playerTurn) => {
  questionValue = null
  answerValue = null
  peopleLeft = 0
  console.log("** FREQUENCIES **")
  Object.keys(activeCards["total"]).forEach(atrib => {
    if(atrib != "total") 
      console.log(`${atrib} ${getFrequency(atrib,activeCards)}`)
  })
  if (playerTurn) {
    turn = true
    playerMove()
    // check 2 times per second
  } else {
    turn = false
    myMove()
  }
}
