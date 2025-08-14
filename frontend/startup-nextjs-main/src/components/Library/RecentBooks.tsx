"use client";
import { useEffect, useState } from "react";

export default function RecentBooks() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // remplace par backend
    setBooks([
      { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", cover: "/covers/petitprince.jpg" },
      { id: 2, title: "L'Étranger", author: "Albert Camus", cover: "/covers/etranger.jpg" },
      { id: 3, title: "1984", author: "George Orwell", cover: "/covers/1984.jpg" },
      { id: 4, title: "Harry Potter", author: "J.K. Rowling", cover: "/covers/harrypotter.jpg" },
      { id: 5, title: "Les Misérables", author: "Victor Hugo", cover: "/covers/lesmiserables.jpg" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <img src={book.cover} alt={book.title} className="w-full h-60 object-cover rounded-lg mb-4" />
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">{book.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{book.author}</p>
        </div>
      ))}
    </div>
  );
}
