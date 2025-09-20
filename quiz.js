document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        "How often do you feel overwhelmed by your daily responsibilities?",
        "How often do you experience difficulty sleeping due to stress?",
        "How often do you feel anxious or worried without a clear reason?",
        "How frequently do you find it hard to concentrate?",
        "How often do you feel irritated or angry without major reasons?",
        "How often do you feel isolated or lonely?",
        "How frequently do you get physical symptoms like headaches or fatigue due to stress?",
        "How often do you feel a lack of motivation to do routine tasks?",
        "How often do you find yourself overthinking small issues?",
        "How often do you feel hopeless about the future?"
    ];

    const quizForm = document.getElementById('quizForm');

    // Dynamically create all questions at once
    questions.forEach((q, i) => {
        const questionIndex = i + 1;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        // Add animation delay for staggered effect
        questionDiv.style.animationDelay = `${i * 0.1}s`;
        
        questionDiv.innerHTML = `
            <p>${questionIndex}. ${q}</p>
            <div class="scale">
                <span>Never</span>
                <div class="range-slider-container">
                    <div class="slider-track"><div class="slider-fill"></div></div>
                    <input type="range" name="q${questionIndex}" min="1" max="10" value="5">
                    <div class="range-value">5</div>
                </div>
                <span>Always</span>
            </div>
        `;
        quizForm.appendChild(questionDiv);
    });

    // Add event listeners for all the dynamic sliders
    const allRanges = document.querySelectorAll('input[type="range"]');
    allRanges.forEach(range => {
        const container = range.closest('.range-slider-container');
        const valueDisplay = container.querySelector('.range-value');
        const fill = container.querySelector('.slider-fill');

        const updateSlider = () => {
            const value = range.value;
            const min = range.min;
            const max = range.max;
            const percentage = ((value - min) / (max - min)) * 100;
            
            valueDisplay.textContent = value;
            valueDisplay.style.left = `calc(${percentage}% - (${percentage / 50 - 1} * 8px))`; // Offset compensation
            fill.style.width = `${percentage}%`;
        };
        
        range.addEventListener('input', updateSlider);
        updateSlider(); // Initial call to set position
    });
});


// --- CORE LOGIC - UNCHANGED ---
function calculateScore() {
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    let val = document.querySelector(`[name=q${i}]`).value;
    total += parseInt(val);
  }
  
  const resultDiv = document.getElementById("result");
  const resultContainer = document.getElementById("result-container");
  let resultText = "";
  
  resultDiv.className = ''; // Reset classes

  if (total <= 30) {
    resultText = `Your Score: ${total}/100\n\n🟢 Your stress level appears to be low. Keep up the great self-care!`;
    resultDiv.classList.add("low-stress");
  } else if (total <= 70) {
    resultText = `Your Score: ${total}/100\n\n🟡 Your stress level appears to be moderate. Consider exploring some relaxation techniques or talking to someone.`;
    resultDiv.classList.add("moderate-stress");
  } else {
    resultText = `Your Score: ${total}/100\n\n🔴 Your stress level appears to be high. It's important to prioritize your well-being. Please consider reaching out for support.`;
    resultDiv.classList.add("high-stress");
  }

  resultDiv.innerText = resultText;
  resultContainer.classList.remove('hidden');
}

