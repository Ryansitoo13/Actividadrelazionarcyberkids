document.addEventListener("DOMContentLoaded", function () {
    const draggables = document.querySelectorAll(".draggable");
    const droppables = document.querySelectorAll(".droppable");
    const restartBtn = document.getElementById("restart-btn");
    let score = 0;

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
                score++; // Aumenta la puntuación
                document.getElementById("score").innerText = score;
            } else {
                this.classList.add("wrong");
                setTimeout(() => this.classList.remove("wrong"), 1000);
            }

            checkWin();
        });
    });

    function checkWin() {
        if (document.querySelectorAll(".correct").length === draggables.length) {
            document.getElementById("message").innerText = "¡Bien hecho! Has relacionado todos los ataques correctamente.";
        }
    }

    restartBtn.addEventListener("click", function () {
        // Reiniciar el juego
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
    });
});


