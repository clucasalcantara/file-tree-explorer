import type { InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";
import { AiFillFolderOpen } from "react-icons/ai";
import { FileTree } from "@/components/file-tree";
import { useCallback, useState } from "react";

import absoluteUrl from "next-absolute-url";

import type { DataNode } from "@/components/file-tree/types";

const inter = Inter({ subsets: ["latin"] });

export default function Home(
  props: InferGetServerSidePropsType<typeof Home.getInitialProps>
) {
  const {
    data: { files = [] as unknown as DataNode },
  } = props || {};

  const [expandedItems, setExpandedItems] = useState<string[]>([
    "src",
    "components",
    "styles",
    "public",
  ]);
  const [actionedItems, setActionedItems] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<string>("");

  const handleExpandAll = useCallback(() => {
    const items = files.children?.reduce((acc: string[], file: DataNode) => {
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
    }, []) as string[];

    setExpandedItems(items);
  }, [files.children]);

  const resetExpandAll = useCallback(
    (name: string) => {
      setExpandedItems(expandedItems.filter((item) => item === (name || ""))),
        setActionedItems(actionedItems.filter((item) => item === (name || "")));
    },
    [expandedItems, actionedItems]
  );

  return files.name ? (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex w-full px-16 py-6 bg-white bg-opacity-25 rounded-lg flex-col">
        <h1
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() =>
            expandedItems.length < 4 ? handleExpandAll() : resetExpandAll("")
          }
        >
          <AiFillFolderOpen />
          {files.name.toUpperCase()}
        </h1>
        <FileTree
          actionedItems={actionedItems}
          handleActionedItem={setActionedItems}
          handleHilighted={setHighlighted}
          highlighted={highlighted}
          files={files}
          resetExpandAll={resetExpandAll}
          expandedItems={expandedItems}
        />
      </div>
    </main>
  ) : null;
}

Home.getInitialProps = async ({ req }: any) => {
  const { origin } = absoluteUrl(req);

  const res = await fetch(`${origin}/api/files`);
  const data = await res.json();

  return { data };
};
