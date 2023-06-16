import { useEffect, useState } from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";

import { Leaf } from "./partials";
import { DataNode } from "./types";

type FileTreeProps = {
  files: DataNode;
  resetExpandAll?: () => void;
  expandedItems?: string[];
};

export default function FileTree({
  files,
  resetExpandAll,
  expandedItems = [],
}: FileTreeProps) {
  const { children } = files;
  const [actionedItems, setActionedItems] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<string>("");

  const handleExpand = (name: string) => {
    resetExpandAll?.();

    const expandedItems = [...actionedItems];

    if (expandedItems.includes(name)) {
      setHighlighted("");

      return setActionedItems(
        expandedItems.filter((item: string) => item !== name)
      );
    }

    expandedItems.push(name);
    setHighlighted(name);

    return setActionedItems(expandedItems);
  };

  return (
    <div className="flex flex-col ml-[20px]">
      <div className="flex flex-col gap-1">
        {children?.map((child: DataNode) => {
          const { name, children } = child;

          const isFolderOpen =
            actionedItems.includes(name) || expandedItems.includes(name);
          const isHighlighted = highlighted === name;

          if (children) {
            return (
              <div key={name} className="cursor-pointer">
                <h2
                  className={`flex flex-row items-center gap-1 px-5 ${
                    isHighlighted && "bg-[blue] bg-opacity-25 rounded-[5px]"
                  }`}
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();

                    handleExpand(name);
                  }}
                >
                  {isFolderOpen ? <AiFillFolderOpen /> : <AiFillFolder />}
                  {name}
                </h2>
                {isFolderOpen && (
                  <FileTree
                    files={child}
                    expandedItems={expandedItems}
                    resetExpandAll={resetExpandAll}
                  />
                )}
              </div>
            );
          }

          return (
            <div
              key={name}
              className={`flex flex-row items-center gap-1 cursor-pointer px-5 ${
                isHighlighted && "bg-green-500 bg-opacity-25 rounded-[5px]"
              }`}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                event.preventDefault();

                handleExpand(name);
              }}
            >
              - <Leaf name={name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
