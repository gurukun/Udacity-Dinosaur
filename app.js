//store data
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

Creature.prototype.heightCompare = function(human){
  const heightDifference = this.height - human;
  const heightFact = `${this.species} is ${heightDifference}' taller than you. Yes, they are tall!`
  this.fact.push(heightFact)
};

Creature.prototype.weightCompare = function(human){
  let weightFact = "";
  if (human > this.weight) {
    const difference = human - this.weight;
    weightFact = `You are ${difference} lb heavier than ${this.species}!`;
  } else if (human === this.weight) {
    weightFact = "You and " + this.species + " are equally tall.";
  } else {
    weightFact = "You are lighter than " + this.species + ". Yes, dinosaurs are heavy!";
  }
  this.fact.push(weightFact)
};

Creature.prototype.dietCompare = function(human){
  let dietFact = "";
  if (human === this.diet) {
    dietFact = "You have same diet as " + this.species + ". Would be fun to share meal with them!";
  } else {
    dietFact = "Your diet is defferent from " + this.species + ". Everyone is different:)";
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
  this.fact = '<br><br>';
};

function createCreatures(data, human){
 data.map(obj => {
  if(obj.species === 'Pigeon'){
    let pigeon = new Pigeon(obj.species, obj.weight, obj.height, obj.diet, obj.where, obj.when, obj.fact)
    allCreatures.push(pigeon)
  } else {
    let dino = new Creature(obj.species, obj.weight, obj.height, obj.diet, obj.where, obj.when, obj.fact);
    dino.heightCompare(human.feet);
    dino.weightCompare(human.weight);
    dino.dietCompare(human.diet)
    allCreatures.push(dino);}
 })
 let person = new Human('Human', human.weight, human.feet+'.'+human.inches, human.diet, human.name);
 allCreatures.splice(4, 0, person);
}

const render = obj => {
    let gridItems = ""
    let gridElm = document.getElementById('grid')
    
    obj.forEach((data, i) => {
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
