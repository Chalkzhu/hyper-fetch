import { TreeItem } from "react-complex-tree";
import { EllipsisIcon, FolderIcon } from "lucide-react";

import * as DropdownMenu from "components/dropdown/dropdown";
import { IconButton } from "components/icon-button/icon-button";
import { DevtoolsExplorerFolder } from "../content.types";
import { useDevtoolsContext } from "devtools.context";
import { createStyles } from "theme/use-styles.hook";

const styles = createStyles((isLight, css) => {
  return {
    item: css`
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    title: css`
      display: flex;
      align-items: center;
      gap: 5px;

      & svg {
        width: 16px;
        height: 16px;
      }
    `,
  };
});

export const Folder = ({ item }: { item: TreeItem<DevtoolsExplorerFolder> }) => {
  const { treeState } = useDevtoolsContext("DevtoolsExplorerFolder");
  const css = styles.useStyles();

  const addNewFolder = () => {
    treeState.injectItem(window.prompt("Item name") ?? "New item", item.index);
  };

  return (
    <div className={css.item}>
      <span className={css.title}>
        <FolderIcon />
        {item.data.name}
      </span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisIcon />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <FolderIcon />
            Folder
          </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              Rename
              <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={addNewFolder}>
              Add folder
              <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Run folder
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              View documentation
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Add Request</DropdownMenu.Item>
          <DropdownMenu.Item>View documentation</DropdownMenu.Item>
          <DropdownMenu.Item>Support</DropdownMenu.Item>
          <DropdownMenu.Item>API</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
