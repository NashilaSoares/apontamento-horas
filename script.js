document.getElementById("add-atividade").addEventListener("click", function() {
    var novaAtividade = document.createElement("div");
    novaAtividade.classList.add("atividade");
    
    novaAtividade.innerHTML = `
        <div class="form-group">
            <label class="required" for="atividade">Atividade:</label>
            <input type="text" class="input-field atividade-input" placeholder="Digite a atividade">
            <label for="jira-task">Nº Task Jira:</label>
            <input type="text" class="input-field jira-input" placeholder="Ex: EUR-397">
            <label class="required" for="tempo">Tempo:</label>
            <input type="text" class="input-field tempo-input" placeholder="00:00" maxlength="5" onblur="completarTempo(this); atualizarContador();" onkeypress="validaHoras(this, event)" inputmode="numeric" pattern="[0-9]*">
            <button class="btn-excluir" onclick="excluirAtividade(this)">Excluir</button>
        </div>
    `;
    
    document.getElementById("atividades-container").appendChild(novaAtividade);
    document.getElementById("resultado").innerText = ""; // Limpa o resultado ao adicionar nova atividade
    atualizarContador();
});

// Adicionando restrição para permitir apenas números no campo de tempo
// Este código impede que caracteres não numéricos sejam inseridos

document.getElementById("atividades-container").addEventListener("input", function(event) {
    if (event.target.classList.contains("tempo-input")) {
        event.target.value = event.target.value.replace(/[^0-9]/g, ""); // Permite apenas números
    }
});


document.getElementById("gerar-btn").addEventListener("click", function() {
    var atividades = document.querySelectorAll(".atividade");
    var resultadoTexto = "";
    var erro = false;

    atividades.forEach(function(atividade) {
        var tempo = atividade.querySelector(".tempo-input").value;
        var jira = atividade.querySelector(".jira-input").value;
        var descricao = atividade.querySelector(".atividade-input").value;

        if (!tempo || !descricao) {
            alert("Por favor, preencha os campos obrigatórios antes de gerar o relatório.");
            erro = true;
            return;
        }
        resultadoTexto += `[${tempo}]`;
        if (jira.trim() !== "") {
            resultadoTexto += `[${jira}]`;
        }
        resultadoTexto += `[${descricao}]
`;
    });

    if (!erro && resultadoTexto.trim() !== "") {
        document.getElementById("resultado").innerText = resultadoTexto;
    }
});


function excluirAtividade(botao) {
    botao.closest(".atividade").remove();
    atualizarContador();
}

function completarTempo(input) {
    var valor = input.value.replace(":", "").replace(/\D/g, "");
    while (valor.length < 4) {
        valor = "0" + valor;
    }
    input.value = valor.slice(0, 2) + ":" + valor.slice(2, 4);
}

function atualizarContador() {
    var totalMinutos = 0;
    document.querySelectorAll(".tempo-input").forEach(function(input) {
        var tempo = input.value;
        if (tempo) {
            var partes = tempo.split(":");
            if (partes.length === 2) {
                totalMinutos += parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
            }
        }
    });

    var horasTotais = Math.floor(totalMinutos / 60);
    var minutosTotais = totalMinutos % 60;
    document.getElementById("total").innerText = `${horasTotais}:${minutosTotais.toString().padStart(2, '0')}`;
}

