import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

// Définition du type pour la priorité d'une tâche
type Priority = "Urgente" | "Moyenne" | "Basse"

// Définition du type pour une tâche
type Todo = {
  id: number; // identifiant unique
  text: string; // texte de la tâche
  priority: Priority // priorité de la tâche
}

function App() {
  const [input, setInput] = useState<string>("") // State pour le texte de la nouvelle tâche
  const [priority, setPriority] = useState<Priority>("Moyenne") // State pour la priorité sélectionnée

  // Récupération des tâches sauvegardées dans le localStorage
  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []

  const [todos, setTodos] = useState<Todo[]>(initialTodos) // State pour la liste des tâches
  const [filter, setFilter] = useState<Priority | "Tous">("Tous") // State pour le filtre de priorité

  // Sauvegarde automatique des tâches à chaque modification
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Ajoute une nouvelle tâche à la liste
  function addTodo() {
    if (input.trim() == "") {
      return
    }

    const newTodo: Todo = {
      id: Date.now(), // Utilise le timestamp comme identifiant unique
      text: input.trim(),
      priority: priority
    }

    const newTodos = [newTodo, ...todos]
    setTodos(newTodos)
    setInput("") // Réinitialise le champ texte
    setPriority("Moyenne") // Réinitialise la priorité
  }

  // Filtrage des tâches selon la priorité sélectionnée
  let filteredTodos: Todo[] = []

  if (filter === "Tous") {
    filteredTodos = todos
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }

  // Calcul du nombre de tâches par priorité
  const urgentCount = todos.filter((t) => t.priority === "Urgente").length
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length
  const lowCount = todos.filter((t) => t.priority === "Basse").length
  const totalCount = todos.length

  // Supprime une tâche selon son id
  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  // State pour la sélection de tâches à finir
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())


  // Ajoute ou retire une tâche de la sélection
  function toggleSelectTodo(id: number) {
    const newSelected = new Set(selectedTodos)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTodos(newSelected)
  }

  // Supprime toutes les tâches sélectionnées
  function finishSelected() {
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
        return false
      } else {
        return true
      }
    })

    setTodos(newTodos)
    setSelectedTodos(new Set())
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        {/* Section d'ajout de tâche */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>
        {/* Section de filtres et actions */}
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Boutons de filtre par priorité */}
              <button
                className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Tous")}
              >
                Tous ({totalCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Urgente")}
              >
                Urgente ({urgentCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne ({mediumCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Basse")}
              >
                Basse ({lowCount})
              </button>
            </div>
            {/* Bouton pour finir les tâches sélectionnées */}
            <button
              onClick={finishSelected}
              className="btn btn-primary"
              disabled={selectedTodos.size == 0}
            >
              Finir la sélection ({selectedTodos.size})
            </button>

          </div>

          {/* Affichage des tâches filtrées */}
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={toggleSelectTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            // Message si aucune tâche ne correspond au filtre
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
              </div>
              <p className="text-sm">Aucune tâche pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
