const createElement = (arr) =>{
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const loadLessons = () => {
   fetch("https://openapi.programming-hero.com/api/levels/all")
   .then((res) => res.json())
   .then((json) => displayLessons(json.data));
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    
    lessonButtons.forEach((btn) => btn.classList.remove("active")); 
}
const loadLevelWord = (id) =>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then((res) =>res.json())
    .then((data)=> {
        removeActive();
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add("active");
        displayLevelWord(data.data);
    })
};

const displayLevelWord = (words) => {
    const levelWordContainer =document.getElementById("word-container");
    levelWordContainer.innerHTML = "";

    if(words.length == 0){
        levelWordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl  space-y-4 py-10">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-3xl font-bangla">নেক্সট Lesson এ যান</h2>
      </div>
        `;
        manageSpinner(false);
        return;
    }
    words.forEach(word =>{
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="text-xl font-bold">${word.word ? word.word : "No Word Found"}</h2>
        <p class="font-medium">Meaning /Pronounciation</p>
        <h2 class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "No Meaning Found" } / ${word.pronunciation ? word.pronunciation: "No Pronunciation Found" }</h2>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-low"></i></button>
        </div>
      </div>
        `;

        levelWordContainer.append(wordCard);
    });
    manageSpinner(false);
};

const loadWordDetails = async (id) =>{
    const url =`https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (word) =>{
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML =`
        <div id="details-container" class="space-y-5">
    <div class="">
      <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation })</h2>
    </div>
    <div class="">
      <h2 class="text-2xl font-bold">Meaning</h2>
      <p class="font-bangla">${word.meaning}</p>
    </div>
    <div class="">
      <h2 class="text-2xl font-bold">Example</h2>
      <p class="">${word.sentence}</p>
    </div>
    <div class="">
      <h2 class="font-bangla">সমার্থক শব্দ গুলো</h2>
      <div class="">${createElement(word.synonyms)}</div>
    </div>
   </div>
    
    `;
    document.getElementById("word_modal").showModal();
}

const displayLessons = (lessons) =>{
// 1.get the container and empty
    const lessonsContainer = document.getElementById("level-container");
    lessonsContainer.innerHTML = "";
// 2.get into every lesson

    for(let lesson of lessons){
        // 3.create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML =`
                <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <span><i class="fa-solid fa-book-open"></i></span>Lesson - ${lesson.level_no}
                </button>
        `;
        // 4.append into container
        lessonsContainer.append(btnDiv);
    }
}

const manageSpinner = (status) =>{
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
         document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

loadLessons();

document.getElementById("btn-search").addEventListener("click", ()=>{
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue= input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allWords = data.data;
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue))
        displayLevelWord(filterWords);
    });
    
})