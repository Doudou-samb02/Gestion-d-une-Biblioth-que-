"use client";
import { useEffect, useState } from "react";

export default function TopAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    //remplace par backend
    setAuthors([
      { id: 1, name: "J.K. Rowling", books: 7 },
      { id: 2, name: "Victor Hugo", books: 10 },
      { id: 3, name: "George Orwell", books: 5 },
      { id: 4, name: "Albert Camus", books: 6 },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {authors.map((author) => (
        <div
          key={author.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
        >
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            {author.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {author.books} livres
          </p>
        </div>
      ))}
    </div>
  );
}
