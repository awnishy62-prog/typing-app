document.addEventListener("DOMContentLoaded", () => {
  // -------- Existing Typing Logic --------
  const input = document.getElementById("typing-input");
  const textToType = document.getElementById("text-to-type");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  let startTime = null;
  let correctChars = 0;

  // Highlight key on virtual keyboard
  document.addEventListener("keydown", (e) => {
    const keyEl = document.querySelector(`[data-key="${e.key}"]`);
    if (keyEl) {
      keyEl.classList.add("active");
      setTimeout(() => keyEl.classList.remove("active"), 200);
    }
  });

  // Typing logic
  input.addEventListener("input", () => {
    if (!startTime) startTime = new Date();
    const typed = input.value;
    const target = textToType.textContent;

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) correct++;
    }
    correctChars = correct;

    // Accuracy
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    accuracyDisplay.textContent = accuracy + "%";

    // WPM
    const elapsed = (new Date() - startTime) / 60000; // minutes
    const wpm = elapsed > 0 ? Math.round((typed.length / 5) / elapsed) : 0;
    wpmDisplay.textContent = wpm;
  });

  // -------- New Animations & Interactivity --------

  // Animate progress bar
  const progress = document.querySelector(".progress-bar");
  if (progress) {
    setTimeout(() => {
      progress.style.width = "70%"; // You can dynamically calculate this value
    }, 500);
  }

  // Punchcard interactivity
  const punchCells = document.querySelectorAll(".punchcard-cell");
  punchCells.forEach(cell => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("active");
    });
  });

  // Calendar interactivity
  const calendarDays = document.querySelectorAll(".calendar-day");
  calendarDays.forEach(day => {
    day.addEventListener("click", () => {
      day.classList.toggle("active");
    });
  });

  // Local storage example
  let typingData = {
    activeTime: 88,
    passedAttempts: 88,
    failedAttempts: 0,
    partialAttempts: 0,
    typingSpeed: 17
  };

  localStorage.setItem("typingData", JSON.stringify(typingData));

  let savedData = JSON.parse(localStorage.getItem("typingData"));

  const statCard = document.querySelector(".stat-card p");
  if (statCard && savedData) {
    statCard.textContent = `${savedData.activeTime} seconds`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const rows = [
    { id: 'homeRowLevels', name: 'home', base: 1 },
    { id: 'topRowLevels', name: 'top', base: 11 },
    { id: 'bottomRowLevels', name: 'bottom', base: 21 },
    { id: 'sentenceLevels', name: 'sentence', base: 31 }
  ];

  rows.forEach(row => {
    const container = document.getElementById(row.id);
    for (let i = 0; i < 10; i++) {
      const levelNumber = row.base + i;
      const isUnlocked = isLessonUnlocked(levelNumber);

      const lesson = document.createElement('a');
      lesson.className = 'lesson-box';
      lesson.textContent = `${i + 1}\nLevel ${levelNumber}`;
      lesson.href = isUnlocked ? `typing.html?lesson=${levelNumber}` : "#";
      if (!isUnlocked) {
        lesson.classList.add('locked');
        lesson.title = "Complete the previous level to unlock.";
      }
      container.appendChild(lesson);
    }
  });
});

// Simple progress tracking using localStorage
function isLessonUnlocked(lesson) {
  if (lesson === 1) return true; // Always unlock first lesson
  const completed = parseInt(localStorage.getItem("lastCompletedLesson") || "0");
  return completed >= lesson - 1;
}
