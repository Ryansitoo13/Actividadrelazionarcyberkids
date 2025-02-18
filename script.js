document.addEventListener("DOMContentLoaded", function () {
    const draggables = document.querySelectorAll(".draggable");
    const droppables = document.querySelectorAll(".droppable");

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
});

