import type { InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";
import { AiFillFolderOpen } from "react-icons/ai";
import { FileTree } from "@/components/file-tree";
import { useCallback, useState } from "react";

import type { DataNode } from "@/components/file-tree/types";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  data: { files },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "src",
    "components",
    "styles",
    "public",
  ]);

  const handleExpandAll = () => {
    const items = files.children.reduce((acc: string[], file: DataNode) => {
      if (file.kind === "directory") {
        acc.push(file.name);
      }
      if (file.children) {
        file.children.forEach((child: DataNode) => {
          if (child.kind === "directory") {
            acc.push(child.name);
          }
        });
      }

      return acc;
    }, []);

    setExpandedItems(items);
  };

  const resetExpandAll = useCallback(() => setExpandedItems([]), []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex w-full px-16 py-6 bg-white bg-opacity-25 rounded-lg flex-col">
        <h1
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() =>
            expandedItems.length < 4 ? handleExpandAll() : resetExpandAll()
          }
        >
          <AiFillFolderOpen />
          {files.name.toUpperCase()}
        </h1>
        <FileTree
          files={files}
          resetExpandAll={resetExpandAll}
          expandedItems={expandedItems}
        />
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/files");
  const data = await res.json();

  return { props: { data } };
}
