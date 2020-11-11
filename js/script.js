const urlAPI = 'http://mozona-tarefas.test/api/';
var divLista = document.getElementById("lista");
var idTarefa = null;

function formatarData(dataNaoFormatada) {
    if (dataNaoFormatada) {
        let DataParcelada = dataNaoFormatada.match(/\d+/g),
            ano = DataParcelada[0].substring(0),
            mes = DataParcelada[1],
            dia = DataParcelada[2],
            hora = DataParcelada[3],
            minuto = DataParcelada[4];

        return `${dia} - ${mes} - ${ano} ${hora}:${minuto}`;
    }
    return null;

}
function resetar() {
    idTarefa = null;
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("botao-accao").value = "Editar";
}
function editarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    fetch(`${urlAPI}actualizar-tarefa`,
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idTarefa,
                titulo: titulo,
                descricao: descricao
            })
        }
    )
        .then((resp) => resp.json()) // Transformar a resposta em JSON
        .then(function (dados) {
            if (dados.exito) {
                resetar();

                listarTarefas();
                alert(dados.mensagem);
            }
            else {
                alert("Falha ao adicionar tarefa");
            }
        })
}

function selecionarParaEditar(evento) {
    idTarefa = evento.target.getAttribute("data-id")
    document.getElementById("botao-accao").innerText = "Editar"
    fetch(`${urlAPI}tarefa/${idTarefa}`)
        .then((resp) => resp.json()) // Transformar a resposta em JSON
        .then(function (dados) {
            if (dados.exito) {
                document.getElementById("titulo").value = dados.tarefa.titulo;
                document.getElementById("descricao").value = dados.tarefa.descricao;
            }
            else {
                alert("Falha ao pegar a Tarefa")
            }



        })
}

function apagarTarefa(evento) {
    id = evento.target.getAttribute("data-id");
    if (confirm("Tens a certeza que deseja apagar a tarefa?")) {
        fetch(`${urlAPI}eliminar-tarefa`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                })
            }
        )
            .then((resp) => resp.json()) // Transformar a resposta em JSON
            .then(function (dados) {
                if (dados.exito) {
                    alert(dados.mensagem);
                    listarTarefas();
                }
                else {
                    alert("Falha ao apagar tarefa");
                }
            })

    }

}
function adicionarEventos() {
    let botoesEditar = document.getElementsByClassName("editar");
    let botoesApagar = document.getElementsByClassName("apagar");


    for (let index = 0; index < botoesEditar.length; index++) {
        const elemento = botoesEditar[index];
        elemento.addEventListener("click", selecionarParaEditar, false)
    }

    for (let index = 0; index < botoesApagar.length; index++) {
        const elemento = botoesApagar[index];
        elemento.addEventListener("click", apagarTarefa, false)
    }


}

function listarTarefas() {
    fetch(`${urlAPI}listar-tarefas`)
        .then((resp) => resp.json()) // Transformar a resposta em JSON
        .then(function (dados) {
            if (dados.exito) {
                let tarefas = '<div class="tarefas">';
                dados.tarefas.forEach(element => {
                    tarefas += `<div class="tarefa-item">
            <div class="id">${element.id}</div>
            <div class="titulo">${element.titulo}</div>
            <div class="descricao">${element.descricao}</div>
            <div class="criado-aos">${formatarData(element.created_at)}</div>
            <div class="editar" data-id="${element.id}">Editar</div>
            <div class="apagar"  data-id="${element.id}">Apagar</div>
            </div>
            `
                });
                tarefas += '</div>';
                divLista.innerHTML = tarefas
                adicionarEventos();
            }
            else {
                alert("Falha ao pegar as Tarefas")
            }
        })
}
window.onload = function (e) {
    listarTarefas();
}

function adicionarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    fetch(`${urlAPI}criar-tarefa`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: titulo,
                descricao: descricao
            })
        }
    )
        .then((resp) => resp.json()) // Transformar a resposta em JSON
        .then(function (dados) {
            if (dados.exito) {
                listarTarefas();
                alert(dados.mensagem);
            }
            else {
                alert("Falha ao adicionar tarefa");
            }
        })

}
function adicionarOuEditarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    if (!titulo && !descricao) {
        alert("Preencha devidamento os campos")
    }
    else {
        if (idTarefa) {
            editarTarefa()
        }
        else {
            adicionarTarefa()
        }
    }
}


