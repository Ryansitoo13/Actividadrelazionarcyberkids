document.addEventListener("DOMContentLoaded", function () {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");
  const restartBtn = document.getElementById("restart-btn");
  const message = document.getElementById("message");
  const finalScoreDisplay = document.getElementById("final-score");
  const scoreDisplay = document.getElementById("score");

  let attempts = 0;       
  let score = 0;          
  const maxAttempts = 2;  

  // Activar arrastre en los .draggable
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", event.target.id);
    });
  });

  // Manejo de drop en las definiciones
  droppables.forEach(droppable => {
    droppable.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    droppable.addEventListener("drop", function (event) {
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text");
      const draggedElement = document.getElementById(draggedId);

      // Validar coincidencia con data-match
      if (draggedElement && droppable.getAttribute("data-match") === draggedId) {
        // ¡Correcto!
        let points = parseInt(draggedElement.getAttribute("data-score")) || 10;
        score += points;
        scoreDisplay.textContent = score;

        // Marcar visualmente la definición como correcta (sin cambiar su texto)
        droppable.classList.add("correct-drop");

        // El ataque desaparece de la izquierda
        draggedElement.remove();

        message.style.color = "green";
        message.textContent = "¡Correcto! Sigue colocando los demás.";
      } else {
        // ¡Incorrecto! Se elimina el ataque
        if (draggedElement) {
          draggedElement.remove();
        }
        message.style.color = "red";
        message.textContent = "¡Fallaste!";
      }
    });
  });

  // Botón para finalizar cada intento
  restartBtn.addEventListener("click", function () {
    attempts++;

    if (attempts < maxAttempts) {
      // Primer intento terminado => reiniciamos el tablero
      resetGame();
      message.style.color = "green";
      message.textContent = `Terminaste el intento ${attempts}. ¡A jugar de nuevo!`;
    } else {
      // Segundo intento => fin del juego
      restartBtn.style.display = "none";
      finalScoreDisplay.classList.remove("hidden");
      finalScoreDisplay.textContent = `Tu puntuación final fue: ${score}`;
      message.style.color = "blue";
      message.textContent = "Has agotado tus intentos. Juego finalizado.";

      // Opcional: bloquear las definiciones o marcarlas
      droppables.forEach(d => {
        d.classList.add("finalized-drop");
      });
    }
  });

  function resetGame() {
    // Reiniciar puntaje (si quieres sumarlo entre intentos, coméntalo)
    score = 0;
    scoreDisplay.textContent = score;

    message.textContent = "";
    message.style.color = "black";
    finalScoreDisplay.classList.add("hidden");

    // Quitar clase correct-drop/finalized-drop
    droppables.forEach(d => {
      d.classList.remove("correct-drop", "finalized-drop");
    });

    // Restaurar la columna de Ataques
    const leftContainer = document.getElementById("attacks");
    leftContainer.innerHTML = `
      <h3>Ataques</h3>
      <div class="draggable" draggable="true" id="phishing" data-score="10">Phishing</div>
      <div class="draggable" draggable="true" id="malware" data-score="10">Malware</div>
      <div class="draggable" draggable="true" id="ransomware" data-score="10">Ransomware</div>
      <div class="draggable" draggable="true" id="ingenieria" data-score="10">Ingeniería Social</div>
    `;

    // Volver a habilitar dragstart en estos nuevos .draggable
    const newDraggables = leftContainer.querySelectorAll(".draggable");
    newDraggables.forEach(d => {
      d.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text", e.target.id);
      });
    });
  }
});



