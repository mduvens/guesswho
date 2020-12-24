const cardsNum = document.querySelectorAll('.slot').length;
const cardAssigned = document.getElementById('card-assigned');
const btnRematch = document.getElementById('btn-rematch');

const getRand = limit => Math.round(Math.random() * limit);

cardAssigned.className = 'card card--assigned card-' + getRand(cardsNum);

// btnRematch.onclick = () => {
//   cardAssigned.className = 'card card--assigned card-' + getRand(cardsNum);
// };

//*************************M*************************/
const answerYes = document.querySelector("#answerYES")
const answerNo = document.querySelector("#answerNO")
const questionsHTML = document.querySelector("#questions")
const answersHTML = document.querySelector("#answers")
const endRematch = document.querySelector("#endRematch")
const gameoverHTML = document.querySelector("#gameover")
const endMessageHMTL = document.querySelector("#endMessage")
const questionAskedHMTL = document.querySelector("#questionAsked")
const guessedPersonHTML = document.querySelector("#guesswho")
const myAnswersHMTL = document.querySelector("#myAnswers")
const selectQuestionHMTL = document.querySelector("#selectQuestion")
const finalDivHMTL = document.querySelector("#finalDiv")
const myGuessHMTL = document.querySelector("#myGuess")
const introHTML = document.querySelector("#intro")
const factsKnownHTML = document.querySelector("#factsKnown")

let toClean = [questionAskedHMTL, myAnswersHMTL] // test
let toFinalHide = [answersHTML,questionsHTML,factsKnownHTML]
let frequencies, playerAnswers, myAnswers,
  nPeople, cards, computerCard, possibleAtributes;
let best = {};
let questionValue = null;
let answerValue = null;
let timevar;
let peopleLeft;
let atributeImages = {
  'bald': "👨‍🦲",
  'male': "♂️",
  'glasses': "👓",
  'hat': "👒",
  'beard': "🧔",
  'moustache': "👨",
  'chin-beard':"🧔🏽",
  'white hair':"👵",
  'blond hair':"👱‍♀️",
  'ginger hair':"👨‍🦰",
  'brown hair':"🧑‍",
  'black hair':"👩🏻‍🦱",
  'blue eyes': "👁️‍🗨️",
  'big nose':"👃"
}
let startGame = () => {
    activeCards = {}
    frequencies = {}
    playerAnswers = {}
    myAnswers = {}
    possibleAtributes = []
    cards = Object.keys(people)
    nPeople = cards.length - 1
    computerCard = getRandomCard(cards)
    console.log(`MY CARD: ${computerCard}`)
    toClean.forEach(e => e.innerHTML = "")
    // selectQuestionHMTL.value = ''
    selectQuestionHMTL.length = 1 // clear atributes in case we had more people and choose randomly
    setTotal(people)
    activeCards = JSON.parse(JSON.stringify(people))  // Deep Copy of an object
    Object.keys(people["total"]).forEach(key => {
      possibleAtributes.push(key)
      createAtributeHTML(key) // fill possible atributes HTML
    })
    play(1)
    
}
let createAtributeHTML = (key) => {
  let option = document.createElement("option");
  option.text = `${atributeImages[key]} ${key.toUpperCase()}`
  option.value = key
  selectQuestionHMTL.add(option)
}

let endGame = win => {
  if (win) {
    endMessageHMTL.innerHTML = "🎊 YOU WIN 🥳"
    endMessageHMTL.style.color = "#00dd00"

  } else {
    endMessageHMTL.innerHTML = "🤖 YOU LOSE 😵"
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
    return {atribute: bestAtribute, question: makePhrase(bestAtribute)}
  }
  else{
    return {atribute: null, question: `${Object.keys(activeCards)}`}
  }
 
}

let getQuestionValue = (value) => {
  if (value) {
    questionValue = value
    return value
  } else return null
}
let getAnswerValue = (value) => {
  if (value) {
    answerValue = value
    return value
  } else return null
}

// Get player answer
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

let showGame = () => {
  introHTML.style.display ="none"
}
let showFinal = () => {
  toFinalHide.forEach(e => e.style.display = "none")
  finalDivHMTL.style.display ="block"
}


// Check guessed person by player
$("#guesswho").on('keyup', function (event) {
  if (event.keyCode === 13) { // Enter key pressed
    if (computerCard.toLowerCase() == $("#guesswho").val().toLowerCase())
      endGame(1)

    else
      endGame(0)
    $("#guesswho").val('')
  }
});
// DOM OPS
endRematch.onclick = () => {
  gameoverHTML.style.display = "none"
  cardAssigned.className = 'card card--assigned card-' + getRand(cardsNum);
  startGame()
}

let enableQuestion = () => {
  let flag;
  selectQuestionHMTL.value = ''
  selectQuestionHMTL.length = 1
  logDictionary(people,"PEOPLE")
  possibleAtributes.forEach(key => {
    flag = false
    for(var atribute in myAnswers){ // check if was already asked
      if(atribute == key){
        flag = true
      }
    }
    if(!flag) createAtributeHTML(key)
   
  })
  questionsHTML.style.display = "block"
  answersHTML.style.display = "none"

}
let enableAnswer = () => {
  questionsHTML.style.display = "none"
  answersHTML.style.display = "block"
}


// Check asked question and add the response to the canvas
function checkQuestion(atr) {
  if (atr) {
    let colorAtr;
    myAnswersHMTL.innerHTML = ''
    myAnswers[atr] = people[computerCard][atr] // don't need deep copy
    Object.keys(myAnswers).forEach(ans => {
      if(myAnswers[ans]){
        colorAtr = "#00cc00"
        myAnswersHMTL.innerHTML += `<b style="color:${colorAtr}">${ans.toUpperCase()}✔️</b><br>`

      }else{
        colorAtr = "#ff0000"
        myAnswersHMTL.innerHTML += `<b style="color:${colorAtr}">${ans.toUpperCase()} ❌</b><br>`
      } 
    })
    return {
      atribute: atr,
      answer: myAnswers[atr]
    }

  } else return {
    atribute: null,
    answer: null
  }
}
let myMove = () => {
  // check how many people are left
  best = getBestQuestion() // get question, gets null if there is only 1 person left
  //wait for answer
  if(best["atribute"] == null){
    let person;
    for(var key in activeCards){
      if(key != "total") person = key; // get name of person left
    }
    showFinal()
    myGuessHMTL.innerHTML = `Are you ${person} ?`
    timevar = setInterval(() => { // wait for player to confirm our victory
      if(answerValue){
        finalDivHMTL.style.display = "none"
        clearInterval(timevar)
        if(answerValue == "yes") endGame(0)
        else endGame(1)
      }
    }, 500) 
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
    }, 500) // check 2 times per second
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
    playerMove()
    // check 2 times per second
  } else {
    myMove()
  }
}
startGame()