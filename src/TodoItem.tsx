// Importation de l'icône de corbeille
import { Trash } from "lucide-react";

// Définition du type pour la priorité d'une tâche
type Priority = "Urgente" | "Moyenne" | "Basse"

// Définition du type pour une tâche
type Todo = {
    id: number; // identifiant unique
    text: string; // texte de la tâche
    priority: Priority // priorité de la tâche
}

// Définition des propriétés attendues par le composant
type Props = {
    todo: Todo // la tâche à afficher
    onDelete: () => void // fonction pour supprimer la tâche
    isSelected: boolean // indique si la tâche est sélectionnée
    onToggleSelect: (id: number) => void // fonction pour sélectionner/désélectionner | fonction qui retourne rien
}

// Composant pour afficher une tâche individuelle
const TodoItem = ({ todo, onDelete, isSelected, onToggleSelect }: Props) => {
    return (
        <li className="p-3">
            <div className="flex justify-between items-center">
                {/* Partie gauche : sélection et infos de la tâche */}
                <div className="flex items-center gap-2">
                    {/* Checkbox pour sélectionner la tâche */}
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={isSelected}
                        onChange={() => onToggleSelect(todo.id)}
                    />
                    {/* Texte de la tâche */}
                    <span className="text-md font-bold">
                        <span>{todo.text}</span>
                    </span>
                    {/* Badge de priorité avec couleur dynamique */}
                    <span
                        className={`badge badge-sm badge-soft
                            ${todo.priority === "Urgente"
                                ? "badge-error"
                                : todo.priority === "Moyenne"
                                    ? "badge-warning"
                                    : "badge-success"}`}
                    >
                        {todo.priority}
                    </span>
                </div>
                {/* Bouton pour supprimer la tâche */}
                <button
                    onClick={onDelete}
                    className="btn btn-sm btn-error btn-soft"
                >
                    <Trash className="w-4 h-4" />
                </button>
            </div>
        </li>
    )
}

export default TodoItem
