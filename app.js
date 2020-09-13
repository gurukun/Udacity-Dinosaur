let allCreatures = []

const hide = form => {
  form.classList.add("hide");
};

const humanDatafrom= form => {
  let humanData = {};
  Array.from(form).map((data) => {
    humanData[data.id] = data.value});

  const lowName = humanData.name.toLowerCase();
  (function(capFirst){
  const capName = lowName.charAt(0).toUpperCase() + lowName.slice(1)
  humanData.name = capName;
  })(lowName)

  return humanData;
};

//Base Parent Class
function Creature(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = [fact];
}

Creature.prototype.heightCompare = function(humanf, humani){
  const humaninch = parseInt(humanf*12)+ parseInt(humani);
  const dinoinch = parseInt(this.height);
  console.log(heightDifference,dinoinch,humaninch,humanf,humani);
  const heightDifference = dinoinch - humaninch;
  let heightFact = ""; 
  if (humaninch > dinoinch) {
    heightFact = `You are ${-(heightDifference)} inches taller than ${this.species}.`
  } else if (humaninch === dinoinch) {
    heightFact = "You and " + this.species + " are equally tall.";
  } else {
    heightFact = `${this.species} is ${heightDifference} inches taller than you.`;
  }
  this.fact.push(heightFact)
};

Creature.prototype.weightCompare = function(human){
  let weightFact = "";
  if (human > this.weight) {
    weightFact = "You are heavier than " + this.species + ". That means you are heavier than dinosors!";
  } else if (human === this.weight) {
    weightFact = "Weight of you and " + this.species + " are the same!";
  } else {
    weightFact = "You are lighter than " + this.species + ". Yes, dinosors are heavy!";
  }
  this.fact.push(weightFact)
};

Creature.prototype.dietCompare = function(human){
  let dietFact = "";
  if (human.toLowerCase() === this.diet) {
    dietFact = `You have same diet as ${this.species}. ${human} diet is popular!`;
  } else {
    dietFact = "Your diet is defferent from " + this.species + ".";
  }
  this.fact.push(dietFact)
};

function Pigeon(species, weight, height, diet, where, when, fact){
  Creature.call(this, species, weight, height, diet, where, when);
  this.fact = fact;
};

function Human(species, weight, height, diet, name){
  Creature.call(this, species, weight, height, diet)
  this.name = name;
};

function getRandom(array){
  const human = array[8];  
  let newArr = [];
    for(let i = 0; i < array.length-1; i++){
      const temp = array[i]
      const j = Math.floor(Math.random()*i)
      array[i] = array[j]
      array[j] = temp
    }
  array.pop();
  newArr = array;
  newArr.splice(4, 0, human);
  return newArr;
};

function createCreatures(data, human){
 data.map(obj => {
  if(obj.species === 'Pigeon'){
    let pigeon = new Pigeon(obj.species, obj.weight, obj.height, obj.diet, obj.where, obj.when, obj.fact)
    allCreatures.push(pigeon)
  } else {
    let dino = new Creature(obj.species, obj.weight, obj.height, obj.diet, obj.where, obj.when, obj.fact);
    dino.heightCompare(human.feet, human.inches);
    dino.weightCompare(human.weight);
    dino.dietCompare(human.diet)
    allCreatures.push(dino);}
 })
 let person = new Human('Human', human.weight, human.feet+'.'+human.inches, human.diet, human.name);
 allCreatures.push(person);
}

const render = obj => {
    let gridItems = ""
    let gridElm = document.getElementById('grid')
    let newArr = getRandom(obj)
    newArr.forEach((data, i) => {
      const index = Math.floor(Math.random() * 4);
      let itemElm = '<div class="grid-item" data-key="'+i+'">' +
      '<img src="images/' + data.species.toLowerCase() + '.png" alt="" />' +
      '<h3>'+ (data.name ? data.name : data.species) + '</h3>' +
      '<p>'+(data.fact.length === 4 ? data.fact[index]: data.fact ||'')+'</p>'+
      '</div>';
      gridItems += itemElm;
    });
  gridElm.innerHTML = gridItems
};

function fetchJSONData(){
   return fetch("dino.json")
   .then(function (response) {
   if (response.status !== 200) {
   throw new Error("Looks like there was a problem. Status Code: " +
   response.status);
   }
   return response.json();
   })
   .catch(function(err) {
   throw new Error(err);
   });
 };

const callback = () => {
  let form = document.forms["dino-compare"];
  let human = humanDatafrom(form);
    hide(form);
    fetchJSONData().then(data => {
    createCreatures(data.Dinos, human);
    render(allCreatures);
   })
}

document.getElementById ("btn").addEventListener("click", callback, false)
