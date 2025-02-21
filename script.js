document.addEventListener("DOMContentLoaded", function () {
    const draggables = document.querySelectorAll(".draggable");
    const droppables = document.querySelectorAll(".droppable");
    const restartBtn = document.getElementById("restart-btn");
    const highestScoreDisplay = document.getElementById("highest-score");
    let score = localStorage.getItem("userScore") ? parseInt(localStorage.getItem("userScore")) : 0;
    let highestScore = localStorage.getItem("highestScore") ? parseInt(localStorage.getItem("highestScore")) : 0;
    let attempts = 0;

    // Mostrar la puntuación guardada
    document.getElementById("score").innerText = score;

    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text", event.target.id);
        });
    });

    droppables.forEach(droppable => {
        droppable.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        droppable.addEventListener("drop", function (event) {
            event.preventDefault();
            const draggedId = event.dataTransfer.getData("text");
            const draggedElement = document.getElementById(draggedId);

            if (draggedElement && this.getAttribute("data-match") === draggedId) {
                this.appendChild(draggedElement);
                this.classList.add("correct");

                let points = parseInt(draggedElement.getAttribute("data-score"));
                score += points;
                document.getElementById("score").innerText = score;

                // Guardar la puntuación en localStorage
                localStorage.setItem("userScore", score);
            } else {
                this.classList.add("wrong");
                setTimeout(() => this.classList.remove("wrong"), 1000);
            }
        });
    });

    function endAttempt() {
        attempts++;
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
        }

        if (attempts >= 2) {
            restartBtn.style.display = "none";
            highestScoreDisplay.textContent = `Tu calificación más alta fue: ${highestScore}`;
            highestScoreDisplay.classList.remove("hidden");
        }
    }

    restartBtn.addEventListener("click", function () {
        // Permitir reiniciar después del primer intento, pero no después del segundo
        if (attempts < 2) {
            score = 0;
            document.getElementById("score").innerText = score;
            document.getElementById("message").innerText = "";

            droppables.forEach(droppable => {
                droppable.innerHTML = droppable.getAttribute("data-match");
                droppable.classList.remove("correct", "wrong");
            });

            const leftContainer = document.querySelector(".left");
            draggables.forEach(draggable => {
                leftContainer.appendChild(draggable);
            });

            endAttempt();
        }
    });

    // Mostrar la calificación más alta al cargar la página
    if (highestScore > 0) {
        highestScoreDisplay.textContent = `Tu calificación más alta fue: ${highestScore}`;
        highestScoreDisplay.classList.remove("hidden");
    }
});


