import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Group = {
  id: number;
  name: string;
  description: string;
};

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Remplacer par un fetch API
    setGroups([
      {
        id: 1,
        name: "Les Amis des Chiens",
        description: "Promenades chaque dimanche !",
      },
      {
        id: 2,
        name: "Doggo Squad",
        description: "Pour les chiens hyperactifs 🐶",
      },
    ]);
  }, []);

  const handleCreateGroup = () => {
    if (!name || !description) return;

    const newGroup: Group = {
      id: groups.length + 1,
      name,
      description,
    };

    setGroups([...groups, newGroup]);
    setName("");
    setDescription("");
  };

  return (
    <div className="p-4 space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Créer un groupe</CardTitle>
          <CardDescription>
            Organisez des promenades collectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Nom du groupe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
        <CardFooter className="mt-4">
          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Créer
          </button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.id} className="p-4">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{group.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
