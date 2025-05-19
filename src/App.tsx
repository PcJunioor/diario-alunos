import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LiaEdit } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import "./styles.css";

type Aluno = {
  _id: string;
  nome: string;
  matricula: string;
  curso: string;
  bimestre: string;
};

function App() {
  // criar uma variável de estado em contexto de objeto, para não ter que criar várias variáveis de estado.
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    curso: "",
    bimestre: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [errorNome, setErrorNome] = useState("");
  const [idParaEdicao, setIdParaEdicao] = useState("");

  // o array vazio significa que só vai executar uma única vez
  useEffect(() => {
    buscarAlunos();
  }, []);

  // LIMPAR FORM
  function limparFormulario() {
    setFormData({ nome: "", matricula: "", curso: "", bimestre: "" });
  }
  // PREENCHER ESTADO
  function preencheEstados(aluno: Aluno) {
    setFormData({
      nome: aluno.nome,
      matricula: aluno.matricula,
      bimestre: aluno.bimestre,
      curso: aluno.curso,
    });
    setIdParaEdicao(aluno._id);
  }

  //  SALVAR ALUNO (POST)
  async function salvarALuno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formData.nome === "") {
      setErrorNome("Campo é obrigatório");
      //alert("Nome é obrigatório");
    } else {
      setErrorNome("");
      if (idParaEdicao) {
        try {
          // // formData tem a mesma estrutura do objeto a ser passado no método POST
          // PODERIA SER FEITO DESSA FORMA
          // await axios.post("https://api-aluno.vercel.app/aluno", formData)
          //  *** EDITAR ALUNO (PUT) ***
          await axios.put(
            `https://api-aluno.vercel.app/aluno/${idParaEdicao}`,
            {
              nome: formData.nome,
              matricula: formData.matricula,
              curso: formData.curso,
              bimestre: formData.bimestre,
            }
          );
          buscarAlunos();
          toast("Aluno editado com sucesso");
          // para que quando o usuário editar resetar pra não ter o mesmo id para editar
          setIdParaEdicao("");
          limparFormulario();
        } catch (error) {
          toast("Erro ao editar Aluno");
        }
      } else {
        try {
          // // formData tem a mesma estrutura do objeto a ser passado no método POST
          // PODERIA SER FEITO DESSA FORMA
          // await axios.post("https://api-aluno.vercel.app/aluno", formData)
          await axios.post("https://api-aluno.vercel.app/aluno", {
            nome: formData.nome,
            matricula: formData.matricula,
            curso: formData.curso,
            bimestre: formData.bimestre,
          });
          buscarAlunos();
          toast("Aluno cadastrado com sucesso");
          limparFormulario();
        } catch (error) {
          toast("Erro ao cadastrar Aluno");
        }
      }
    }
  }

  // *** BUSCAR ALUNO (GET) ***
  async function buscarAlunos() {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api-aluno.vercel.app/aluno");
      setAlunos(response.data);
      setIsLoading(false);
    } catch (error) {
      toast("Erro ao buscar alunos");
    }
  }
  //

  // EXCLUIR ALUNO (DELETE)
  async function removerAluno(id: string) {
    try {
      await axios.delete(`https://api-aluno.vercel.app/aluno/${id}`);
      buscarAlunos();
      toast("Aluno excluído com sucesso");
    } catch (error) {
      toast("Erro ao excluir aluno");
    }
  }

  return (
    <div className="home">
      <div className="container_form">
        <h1 className="title_home">Diário Eletrônico</h1>
        <form className="form" onSubmit={(event) => salvarALuno(event)}>
          <div className="container_input">
            <input
              placeholder="Nome"
              value={formData.nome}
              // pega o que tem em formData e altera com o novo valor recebido no formulário
              onChange={(event) =>
                setFormData({ ...formData, nome: event.target.value })
              }
            />
            <span className="error">{errorNome}</span>
          </div>

          <div className="container_input">
            <input
              type="text"
              placeholder="Matrícula"
              value={formData.matricula}
              onChange={(event) =>
                setFormData({ ...formData, matricula: event.target.value })
              }
            />
            <span className="error"></span>
          </div>
          <div className="container_input">
            <select
              name=""
              id=""
              value={formData.curso}
              onChange={(event) =>
                setFormData({ ...formData, curso: event.target.value })
              }
            >
              <option selected>Selecione um curso...</option>
              <option>Back-End</option>
              <option>Front-End</option>
            </select>
            <span className="error"></span>
          </div>

          <div className="container_input">
            <input
              type="text"
              placeholder="Bimestre"
              value={formData.bimestre}
              onChange={(event) =>
                setFormData({ ...formData, bimestre: event.target.value })
              }
            />
            <span className="error"></span>
          </div>
          <button type="submit" className="btn_save_form">
            Salvar
          </button>
        </form>
      </div>
      <div className="container_table">
        <h2>Alunos Cadastrados</h2>
        {/* MOstrar um loading enquanto faz a consulta */}
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <table border={1} className="table_alunos">
            <tr>
              <th className="flex-0">Ordem</th>
              <th className="flex-2">Nome</th>
              <th className="flex-1">Matrícula</th>
              <th className="flex-1">Curso</th>
              <th className="flex-1">Bimestre</th>
              <th className="flex-1">Ações</th>
            </tr>
            {alunos.map((aluno, index) => {
              return (
                <tr key={aluno._id}>
                  <td className="flex-0">{index + 1}</td>
                  <td className="flex-2">{aluno.nome}</td>
                  <td className="flex-1">{aluno.matricula}</td>
                  <td className="flex-1">{aluno.curso}</td>
                  <td className="flex-1">{aluno.bimestre}</td>
                  <td className="flex-1">
                    <MdDelete
                      color="red"
                      size={25}
                      onClick={() => removerAluno(aluno._id)}
                    />
                    <LiaEdit
                      color="#0FBA3F"
                      size={25}
                      onClick={() => preencheEstados(aluno)}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
