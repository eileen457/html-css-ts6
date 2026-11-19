interface FlashCard{
  questionText:string;
  questionAnswer:string;
}

class InvalidUserInputError extends Error{
constructor(message:string){
  super(message);
  this.name="InvalidUserInputError";
}
}


const STORAGE_KEY = "flashcard";

const defaultCards:FlashCard[]=[{
  questionText:"cual es la capital de italia?",
  questionAnswer:"Paris"}
];

function loadCards(): FlashCard[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as FlashCard[];
    
  } catch (error) {
    console.log("Failed to load cards:", error);
  }
  return [...defaultCards];
}

function saveCards():void{
try{
  localStorage.setItem(STORAGE_KEY,JSON.stringify(currentCards))
}catch(error){
console.log("No se pudo guardar la tarjeta:",error);
}
}

let currentCards:FlashCard[]=loadCards();
let currentIndex:number=0;

const flashcard=document.getElementById("flashcard") as HTMLDivElement;
const front=document.querySelector(".front") as HTMLDivElement;
const back=document.querySelector(".back") as HTMLDivElement;
const cardList=document.getElementById("card-list") as HTMLDivElement;
const form=document.getElementById("entry-form") as HTMLFormElement;
const dlt=document.getElementById("delete-btn") as HTMLButtonElement;
const text1=document.getElementById("front-text") as HTMLTextAreaElement;
const text2=document.getElementById("back-text") as HTMLTextAreaElement;

function showCard():void{
  flashcard.classList.remove("flipped");
  const card=currentCards[currentIndex];

  if(!card){
     front.textContent="No question";
     back.textContent="";
     return;
  }

    front.textContent=card.questionText;
    back.textContent=card.questionAnswer;
}

function render():void{
  cardList.innerHTML="";

  currentCards.forEach((card,i)=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.textContent=card.questionText;
    btn.addEventListener("click",()=>{
      currentIndex=i;
      showCard();
    });
    cardList.appendChild(btn);
  });

}

function refrescar():void{
  saveCards();
  render();
  showCard();
}

flashcard.addEventListener("click", () => {
  flashcard.classList.add("flipped");
});

dlt.addEventListener("click",()=>{
  if(currentCards.length===0) return;

currentCards.splice(currentIndex,1);
currentIndex=Math.max(0,currentIndex-1);
refrescar();
});

form.addEventListener("submit",(e)=>{
  e.preventDefault();

  const question=text1.value.trim();
  const answer=text2.value.trim();

  if (question === "" || answer === "") {
    throw new InvalidUserInputError("La pregunta y respuesta no puede estar vacía");
  }

  currentCards.push({questionText:question, questionAnswer:answer});
  currentIndex=currentCards.length-1;

  text1.value="";
  text2.value="";
  refrescar();
});

render();
showCard();
