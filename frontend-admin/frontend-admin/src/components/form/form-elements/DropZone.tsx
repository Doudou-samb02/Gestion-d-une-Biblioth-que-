"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onFileUploaded: (url: string) => void; // 👈 callback pour renvoyer l’URL
}

const DropzoneComponent: React.FC<DropzoneProps> = ({ onFileUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    setPreview(URL.createObjectURL(file)); // 👀 prévisualisation locale
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // ⚡ Appel API backend (Spring Boot)
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'upload");

      const data = await res.json();
      // On suppose que le backend renvoie { url: "/covers/xxx.jpg" }
      onFileUploaded(data.url);
    } catch (err) {
      console.error("Upload échoué", err);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  return (
      <ComponentCard title="Image de couverture">
        <div
            {...getRootProps()}
            className={`transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 p-6 text-center`}
        >
          <input {...getInputProps()} />
          {preview ? (
              <div className="flex flex-col items-center">
                <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-44 object-cover rounded shadow mb-2"
                />
                {uploading ? (
                    <p className="text-sm text-gray-500">⏳ Upload en cours...</p>
                ) : (
                    <p className="text-sm text-green-500">✅ Upload réussi</p>
                )}
              </div>
          ) : (
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive
                      ? "Lâchez le fichier ici"
                      : "Glissez-déposez une image ou cliquez"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, WebP, SVG
                </p>
              </div>
          )}
        </div>
      </ComponentCard>
  );
};

export default DropzoneComponent;
