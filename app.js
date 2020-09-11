//const json ='{"Dinos":[{"species":"Triceratops","weight":13000,"height":114,"diet":"herbavor","where":"North America","when":"Late Cretaceous","fact":"First discovered in 1889 by Othniel Charles Marsh"},{"species":"Tyrannosaurus Rex","weight":11905,"height":144,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"The largest known skull measures in at 5 feet long."},{"species":"Anklyosaurus","weight":10500,"height":55,"diet":"herbavor","where":"North America","when":"Late Cretaceous","fact":"Anklyosaurus survived for approximately 135 million years."},{"species":"Brachiosaurus","weight":70000,"height":"372","diet":"herbavor","where":"North America","when":"Late Jurasic","fact":"An asteroid was named 9954 Brachiosaurus in 1991."},{"species":"Stegosaurus","weight":11600,"height":79,"diet":"herbavor","where":"North America, Europe, Asia","when":"Late Jurasic to Early Cretaceous","fact":"The Stegosaurus had between 17 and 22 seperate places and flat spines."},{"species":"Elasmosaurus","weight":16000,"height":59,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"Elasmosaurus was a marine reptile first discovered in Kansas."},{"species":"Pteranodon","weight":44,"height":20,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"Actually a flying reptile, the Pteranodon is not a dinosaur."},{"species":"Pigeon","weight":0.5,"height":9,"diet":"herbavor","where":"World Wide","when":"Holocene","fact":"All birds are living dinosaurs.<br/><br/>"}]}'
//let objectJson = JSON.parse(json)

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
  const heightFact = `${this.species} is ${heightDifference}' taller than you.<br>Yes, they are tall!`
  this.fact.push(heightFact)
};

Creature.prototype.weightCompare = function(human){
  let weightFact = "";
  if (human > this.weight) {
    weightFact = "You are heavier than " + this.species + ". That means you are heavier than dinosors!";
  } else if (human === this.weight) {
    weightFact = "You and " + this.species + " are equally tall.";
  } else {
    weightFact = "You are lighter than " + this.species + ". Yes, dinosors are heavy!";
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
