document.addEventListener("DOMContentLoaded", function () {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");
  const restartBtn = document.getElementById("restart-btn");
  const message = document.getElementById("message");
  const finalScoreDisplay = document.getElementById("final-score");
  const scoreDisplay = document.getElementById("score");

  let attempts = 0;    // Conteo de intentos (máximo 2)
  let score = 0;       // Puntuación
  const maxAttempts = 2;

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

      // Chequeo de coincidencia
      if (draggedElement && draggedId === this.getAttribute("data-match")) {
        // Correcto
        this.appendChild(draggedElement);

        // Sumamos 10 puntos (o lo que indique data-score)
        let points = parseInt(draggedElement.getAttribute("data-score")) || 10;
        score += points;
        scoreDisplay.textContent = score;

        message.textContent = "¡Correcto! Sigue colocando los demás.";
      } else {
        // Incorrecto: el ataque desaparece
        if (draggedElement) {
          draggedElement.remove();
        }
        message.textContent = "¡Fallaste! Este ataque desaparece.";
      }
    });
  });

  // Botón: Finaliza el intento actual
  restartBtn.addEventListener("click", function () {
    attempts++;

    if (attempts < maxAttempts) {
      // Primer intento finalizado: Reiniciamos tablero
      resetGame();
      message.textContent = `Terminaste el intento ${attempts}. ¡A jugar de nuevo!`;
    } else {
      // Segundo intento: se acaba el juego
      restartBtn.style.display = "none";          // Ocultamos botón
      finalScoreDisplay.classList.remove("hidden");
      finalScoreDisplay.textContent = `Tu puntuación final fue: ${score}`;

      message.textContent = "Has agotado tus intentos. Juego finalizado.";

      // Opcional: poner en gris las definiciones
      droppables.forEach(droppable => {
        droppable.style.backgroundColor = "lightgray";
      });
    }
  });

  // Función que reinicia el tablero, sin afectar el número de intentos
  function resetGame() {
    // Puedes decidir si reinicias la puntuación aquí o la mantienes
    // Para el ejemplo, reiniciamos la puntuación en cada nuevo intento
    score = 0;
    scoreDisplay.textContent = score;
    message.textContent = "";

    droppables.forEach(droppable => {
      // Vacía cada dropzone y recupera su texto original
      droppable.innerHTML = droppable.getAttribute("data-match");
      droppable.style.backgroundColor = "";  // Quita color gris si lo tuviera
    });

    // Regresamos los ataques a su contenedor original
    const leftContainer = document.getElementById("attacks");
    // Reconstruimos los ataques
    leftContainer.innerHTML = `
      <h3>Ataques</h3>
      <div class="draggable" draggable="true" id="phishing" data-score="10">Phishing</div>
      <div class="draggable" draggable="true" id="malware" data-score="10">Malware</div>
      <div class="draggable" draggable="true" id="ransomware" data-score="10">Ransomware</div>
      <div class="draggable" draggable="true" id="ingenieria" data-score="10">Ingeniería Social</div>
    `;

    // Volvemos a habilitar dragstart para los ataques recién creados
    const newDraggables = leftContainer.querySelectorAll(".draggable");
    newDraggables.forEach(draggable => {
      draggable.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text", event.target.id);
      });
    });
  }
});



