document.addEventListener("DOMContentLoaded", function () {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");
  const restartBtn = document.getElementById("restart-btn");
  const message = document.getElementById("message");
  const finalScoreDisplay = document.getElementById("final-score");
  const scoreDisplay = document.getElementById("score");

  let attempts = 0;         // Número de intentos
  let score = 0;            // Puntuación
  const maxAttempts = 2;    // Máximo de 2 intentos

  // Habilitar dragstart
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", event.target.id);
    });
  });

  // Habilitar drop
  droppables.forEach(droppable => {
    droppable.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    droppable.addEventListener("drop", function (event) {
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text");
      const draggedElement = document.getElementById(draggedId);

      // Validar coincidencia
      if (draggedElement && draggedId === this.getAttribute("data-match")) {
        // Correcto
        this.appendChild(draggedElement);
        let points = parseInt(draggedElement.getAttribute("data-score")) || 10;
        score += points;
        scoreDisplay.textContent = score;
        message.textContent = "¡Correcto! Sigue con los demás.";
      } else {
        // Incorrecto
        if (draggedElement) {
          draggedElement.remove();  // Ataque eliminado si falla
        }
        message.textContent = "¡Fallaste!";
      }
    });
  });

  // Botón: Finaliza el intento actual
  restartBtn.addEventListener("click", function () {
    attempts++;

    if (attempts < maxAttempts) {
      // Terminó el 1er intento: Reinicia para el 2do
      resetGame();
      message.style.color = "green";
      message.textContent = `Terminaste el intento ${attempts}. ¡A jugar de nuevo!`;
    } else {
      // Segundo intento: Fin del juego
      restartBtn.style.display = "none"; 
      finalScoreDisplay.classList.remove("hidden");
      finalScoreDisplay.textContent = `Tu puntuación final fue: ${score}`;
      message.textContent = "Has agotado tus intentos. Juego finalizado.";

      // Ponemos en gris las definiciones (opcional)
      droppables.forEach(droppable => {
        droppable.style.backgroundColor = "lightgray";
      });
    }
  });

  // Función que reinicia el tablero
  function resetGame() {
    // Reiniciamos la puntuación en el siguiente intento
    score = 0;
    scoreDisplay.textContent = score;

    // Devolvemos las definiciones originales
    droppables.forEach(droppable => {
      droppable.textContent = droppable.getAttribute("data-original");
      droppable.style.backgroundColor = "";
    });

    // Regresamos los ataques a su contenedor (reconstruimos HTML)
    const leftContainer = document.getElementById("attacks");
    leftContainer.innerHTML = `
      <h3>Ataques</h3>
      <div class="draggable" draggable="true" id="phishing" data-score="10">Phishing</div>
      <div class="draggable" draggable="true" id="malware" data-score="10">Malware</div>
      <div class="draggable" draggable="true" id="ransomware" data-score="10">Ransomware</div>
      <div class="draggable" draggable="true" id="ingenieria" data-score="10">Ingeniería Social</div>
    `;

    // Restablecemos el mensaje
    message.textContent = "";
    message.style.color = "black";

    // Volver a enlazar eventos dragstart en los nuevos ataques
    const newDraggables = leftContainer.querySelectorAll(".draggable");
    newDraggables.forEach(draggable => {
      draggable.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text", event.target.id);
      });
    });
  }
});



