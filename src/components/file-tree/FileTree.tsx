import { useEffect, useState } from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";

import { Leaf } from "./partials";
import { DataNode } from "./types";
import { ActionsMenu } from "../actions-menu";

type FileTreeProps = {
  files: DataNode;
  resetExpandAll?: (name: string) => void;
  handleHilighted: (name: string) => void;
  handleActionedItem: (name: string[]) => void;
  expandedItems?: string[];
  actionedItems?: string[];
  highlighted?: string;
};

export default function FileTree({
  files,
  resetExpandAll,
  handleHilighted,
  highlighted,
  expandedItems = [],
  actionedItems = [],
  handleActionedItem,
}: FileTreeProps) {
  const [selected, setSelected] = useState<DataNode | null>(null);
  const { children } = files;

  const handleExpand = (name: string, fromLeaf: boolean = true) => {
    handleHilighted(name);

    if (!fromLeaf) {
      resetExpandAll?.(name);
    }

    const expandedItems = [...actionedItems];

    if (expandedItems.includes(name)) {
      return handleActionedItem(
        expandedItems.filter((item: string) => item !== name)
      );
    }

    expandedItems.push(name);

    return handleActionedItem(expandedItems);
  };

  return (
    <div className="flex flex-col ml-[20px]">
      <ActionsMenu selected={selected} />
      <div className="flex flex-col gap-1">
        {children?.map((child: DataNode) => {
          const { name, children } = child;

          const isFolderOpen =
            actionedItems.includes(name) || expandedItems.includes(name);
          const isHighlighted = highlighted === name;

          if (children) {
            return (
              <div
                key={name}
                className="cursor-pointer"
                onMouseOver={() => setSelected(child)}
              >
                <h2
                  className={`flex flex-row items-center gap-1 px-5 ${
                    isHighlighted && "bg-[blue] bg-opacity-25 rounded-[5px]"
                  }`}
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();

                    handleExpand(name, false);
                  }}
                >
                  {isFolderOpen ? <AiFillFolderOpen /> : <AiFillFolder />}
                  {name}
                </h2>
                {isFolderOpen && (
                  <FileTree
                    actionedItems={actionedItems}
                    handleActionedItem={handleActionedItem}
                    highlighted={highlighted}
                    handleHilighted={handleHilighted}
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
              onMouseEnter={() => setSelected(child)}
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
