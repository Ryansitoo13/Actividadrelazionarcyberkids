document.addEventListener("DOMContentLoaded", function () {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");
  const restartBtn = document.getElementById("restart-btn");
  const message = document.getElementById("message");
  const finalScoreDisplay = document.getElementById("final-score");
  const scoreDisplay = document.getElementById("score");

  let attempts = 0;        // Número de intentos
  let score = 0;          // Puntuación
  const maxAttempts = 2;  // Máximo de intentos

  // Activar arrastre en cada .draggable
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", event.target.id);
    });
  });

  // Manejo de arrastre/soltado en las definiciones (droppables)
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

        // Marcar visualmente la definición como correcta
        droppable.classList.add("correct-drop");

        // Remover el ataque de la columna izquierda
        draggedElement.remove();

        message.style.color = "green";
        message.textContent = "¡Correcto! Sigue colocando los demás.";
      } else {
        // ¡Incorrecto!
        if (draggedElement) {
          draggedElement.remove();
        }
        message.style.color = "red";
        message.textContent = "¡Fallaste!";
      }
    });
  });

  // Botón para reiniciar cada intento
  restartBtn.addEventListener("click", function () {
    attempts++;

    if (attempts < maxAttempts) {
      // Si no se han terminado los intentos, reiniciar tablero
      resetGame();
      message.style.color = "green";
      message.textContent = `Terminaste el intento ${attempts}. ¡A jugar de nuevo!`;
    } else {
      // Segundo (o último) intento => fin del juego
      restartBtn.style.display = "none";
      finalScoreDisplay.classList.remove("hidden");
      finalScoreDisplay.textContent = `Tu puntuación final fue: ${score}`;

      message.style.color = "blue";
      message.textContent = "Has agotado tus intentos. Juego finalizado.";

      // Bloquear las áreas de definición
      droppables.forEach(d => {
        d.classList.add("finalized-drop");
      });
    }
  });

  function resetGame() {
    // Si quieres llevar la puntuación acumulada entre intentos, comenta la siguiente línea
    score = 0;
    scoreDisplay.textContent = score;

    message.textContent = "";
    message.style.color = "black";
    finalScoreDisplay.classList.add("hidden");

    // Quitar clases de estados anteriores
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

    // Volver a habilitar 'dragstart' en los nuevos .draggable
    const newDraggables = leftContainer.querySelectorAll(".draggable");
    newDraggables.forEach(d => {
      d.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text", e.target.id);
      });
    });
  }
});



