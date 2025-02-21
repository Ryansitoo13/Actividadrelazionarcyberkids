document.addEventListener("DOMContentLoaded", function () {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");
  const restartBtn = document.getElementById("restart-btn");
  
  const finalScoreDisplay = document.getElementById("final-score");
  const highestScoreDisplay = document.getElementById("highest-score");
  const message = document.getElementById("message");

  let attempts = 0;
  let score = 0;
  let highestScore = 0;

  // Arrastrable
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", event.target.id);
    });
  });

  // Droppable
  droppables.forEach(droppable => {
    droppable.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    droppable.addEventListener("drop", function (event) {
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text");
      const draggedElement = document.getElementById(draggedId);

      // Validación de coincidencia
      if (draggedElement && this.getAttribute("data-match") === draggedId) {
        this.appendChild(draggedElement);
        this.classList.add("correct");

        // Aumentar puntuación
        let points = parseInt(draggedElement.getAttribute("data-score")) || 10;
        score += points;
        document.getElementById("score").innerText = score;

        message.textContent = "¡Buen trabajo! Sigue con los demás.";
      } else {
        this.classList.add("wrong");
        message.textContent = "¡Fallaste! Acomódalo de nuevo o revisa otra opción.";
        setTimeout(() => {
          this.classList.remove("wrong");
        }, 1000);
      }
    });
  });

  /**
   * Manejo del botón Reiniciar:
   * Cada vez que presionen, se acaba un intento. Si es su segundo intento,
   * el botón desaparece y mostramos la calificación más alta.
   */
  restartBtn.addEventListener("click", function () {
    attempts++;

    // Actualizamos la calificación más alta si corresponde
    if (score > highestScore) {
      highestScore = score;
    }

    if (attempts < 2) {
      // Primer intento finalizado: Reiniciamos pero todavía queda otro intento
      resetGame();
      message.textContent = `Intento ${attempts} finalizado. ¡Tienes otro intento!`;
    } else {
      // Segundo intento finalizado: ocultamos el botón
      restartBtn.style.display = "none";
      finalScoreDisplay.classList.remove("hidden");
      finalScoreDisplay.textContent = `Tu puntuación en este intento fue: ${score}`;
      
      highestScoreDisplay.classList.remove("hidden");
      highestScoreDisplay.textContent = `Tu calificación más alta fue: ${highestScore}`;

      message.textContent = "¡Has agotado tus intentos!";
    }
  });

  /**
   * Función para reiniciar el juego (mantener la lógica, pero resetear puntuación y el área).
   */
  function resetGame() {
    // Opcional: si quieres que se conserve la puntuación entre intentos, elimina la siguiente línea
    score = 0;
    document.getElementById("score").innerText = score;
    message.textContent = "";

    finalScoreDisplay.classList.add("hidden");
    highestScoreDisplay.classList.add("hidden");

    // Dejar las definiciones vacías y volver a colocar los ataques en su contenedor original
    droppables.forEach(droppable => {
      droppable.innerHTML = droppable.getAttribute("data-match"); // Resetea el texto
      droppable.classList.remove("correct", "wrong");
    });

    const leftContainer = document.getElementById("attacks");
    draggables.forEach(draggable => {
      leftContainer.appendChild(draggable);
    });
  }
});


