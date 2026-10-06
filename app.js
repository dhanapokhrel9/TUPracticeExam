// State
let conceptsData = [];
let exercisesData = [];
let currentExIndex = 0;

// DOM Elements
const conceptsContainer = document.getElementById('concepts-container');
const tabConceptsBtn = document.getElementById('tab-concepts-btn');
const tabExercisesBtn = document.getElementById('tab-exercises-btn');
const conceptsTab = document.getElementById('concepts-tab');
const exercisesTab = document.getElementById('exercises-tab');

const exCounter = document.getElementById('ex-counter');
const exType = document.getElementById('ex-type');
const exPrompt = document.getElementById('ex-prompt');
const exHint = document.getElementById('ex-hint');
const userInput = document.getElementById('ex-user-input');
const checkBtn = document.getElementById('check-btn');

const feedbackBox = document.getElementById('feedback-box');
const feedbackStatus = document.getElementById('feedback-status');
const feedbackCorrect = document.getElementById('feedback-correct');
const feedbackExplain = document.getElementById('feedback-explain');

const prevExBtn = document.getElementById('prev-ex-btn');
const nextExBtn = document.getElementById('next-ex-btn');

// Fetch Data from JSON Files
async function initApp() {
  try {
    const [conceptsRes, exercisesRes] = await Promise.all([
      fetch('./Data/concepts.json'),
      fetch('./Data/exercises.json')
    ]);

    conceptsData = await conceptsRes.json();
    exercisesData = await exercisesRes.json();

    renderConcepts();
    if (exercisesData.length > 0) {
      loadExercise(currentExIndex);
    }
  } catch (error) {
    console.error("Error loading JSON data:", error);
    conceptsContainer.innerHTML = `<div class="loading-state">Failed to load concepts data. Ensure you run via Live Server.</div>`;
  }
}

// Dynamically Render Concepts
function renderConcepts() {
  conceptsContainer.innerHTML = '';

  conceptsData.forEach(item => {
    const card = document.createElement('article');
    card.className = 'concept-card';

    const rulesList = item.rulesEn.map(rule => `<li>${rule}</li>`).join('');
    const examplesList = item.examples ? item.examples.map(ex => `<li>${ex}</li>`).join('') : '';

    card.innerHTML = `
      <div class="card-tag">${item.tag}</div>
      <h2>${item.title}</h2>
      <div class="lang-block en">
        <p><strong>English Rules:</strong></p>
        <ul>${rulesList}</ul>
      </div>
      <div class="lang-block np">
        <p><strong>नेपाली व्याख्या:</strong></p>
        <p>${item.explanationNp}</p>
      </div>
      ${item.examples ? `
        <div class="lang-block examples">
          <p><strong>Examples:</strong></p>
          <ul>${examplesList}</ul>
        </div>
      ` : ''}
    `;

    conceptsContainer.appendChild(card);
  });
}

// Render Exercise Item
function loadExercise(index) {
  const ex = exercisesData[index];
  exCounter.innerText = `Problem ${index + 1} of ${exercisesData.length}`;
  exType.innerText = ex.type;
  exPrompt.innerText = ex.prompt;
  exHint.innerText = ex.hint ? `Hint: ${ex.hint}` : '';
  userInput.value = '';
  feedbackBox.classList.add('hidden');
}

// Check Exercise Answer
checkBtn.addEventListener('click', () => {
  const userText = userInput.value.trim().toLowerCase();
  const correctText = exercisesData[currentExIndex].answer.toLowerCase();
  
  feedbackBox.classList.remove('hidden');
  feedbackCorrect.innerText = `Correct Answer: ${exercisesData[currentExIndex].answer}`;
  feedbackExplain.innerText = `English: ${exercisesData[currentExIndex].explanationEn}\nनेपाली: ${exercisesData[currentExIndex].explanationNp}`;

  if (userText === correctText || (userText.length > 2 && correctText.includes(userText))) {
    feedbackStatus.innerText = "✓ Correct!";
    feedbackStatus.className = "status correct";
  } else {
    feedbackStatus.innerText = "✗ Review Answer Below";
    feedbackStatus.className = "status incorrect";
  }
});

// Tab Controls
tabConceptsBtn.addEventListener('click', () => {
  tabConceptsBtn.classList.add('active');
  tabExercisesBtn.classList.remove('active');
  conceptsTab.classList.add('active');
  exercisesTab.classList.remove('active');
});

tabExercisesBtn.addEventListener('click', () => {
  tabExercisesBtn.classList.add('active');
  tabConceptsBtn.classList.remove('active');
  exercisesTab.classList.add('active');
  conceptsTab.classList.remove('active');
});

// Navigation Controls
prevExBtn.addEventListener('click', () => {
  currentExIndex = (currentExIndex - 1 + exercisesData.length) % exercisesData.length;
  loadExercise(currentExIndex);
});

nextExBtn.addEventListener('click', () => {
  currentExIndex = (currentExIndex + 1) % exercisesData.length;
  loadExercise(currentExIndex);
});

// Initialize on Load
initApp();