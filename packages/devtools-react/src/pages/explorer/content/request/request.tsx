import { TreeItem } from "react-complex-tree";
import { EllipsisIcon, FileUp } from "lucide-react";

import * as DropdownMenu from "components/dropdown/dropdown";
import { IconButton } from "components/icon-button/icon-button";
import { DevtoolsExplorerRequest } from "../content.types";
import { createStyles } from "theme/use-styles.hook";
import { Method } from "components/method/method";

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
    `,
  };
});

export const Request = ({ item }: { item: TreeItem<DevtoolsExplorerRequest> }) => {
  const css = styles.useStyles();

  return (
    <div className={css.item}>
      <span className={css.title}>
        <Method method={item.data.request.method} />
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
            <FileUp />
            Request
          </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              Rename
              <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Show cache
              <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Show in network
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Add example response</DropdownMenu.Item>
          <DropdownMenu.Item>Add request template</DropdownMenu.Item>
          <DropdownMenu.Item>View documentation</DropdownMenu.Item>
          <DropdownMenu.Item>Support</DropdownMenu.Item>
          <DropdownMenu.Item>API</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
