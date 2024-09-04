import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, MoonStar, Settings, Sun, Wifi, WifiOff } from "lucide-react";

import { createStyles } from "theme/use-styles.hook";
import { useDevtoolsContext } from "devtools.context";
import { DevtoolsModule } from "devtools.types";
import { menuIcons } from "./menu.constants";
import * as DropdownMenu from "components/dropdown/dropdown";
import { IconButton } from "components/icon-button/icon-button";
import { tokens } from "theme/tokens";

const styles = createStyles(({ isLight, css }) => {
  return {
    menu: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 70px;
      min-width: 70px;
      border-right: 1px solid ${isLight ? tokens.colors.light[300] : tokens.colors.dark[400]};
      overflow-y: auto;
      padding: 10px 5px;
    `,

    menuLink: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border: 0px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 4px;
      background: transparent;
      color: ${isLight ? tokens.colors.light[700] : tokens.colors.light[500]};
      padding: 10px 0;
      width: 100%;

      & svg {
        width: 20px !important;
        height: 20px !important;
        fill: transparent;
      }

      &:hover {
        background: ${isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.1)"};
      }

      &:focus-within {
        outline-offset: 0px !important;
      }
    `,

    active: css`
      color: ${isLight ? tokens.colors.dark[300] : tokens.colors.light[50]};

      & svg {
        stroke: ${isLight ? tokens.colors.cyan[300] : tokens.colors.cyan[300]}!important;
      }
    `,
  };
});

export enum Positions {
  Top = "Top",
  Left = "Left",
  Right = "Right",
  Bottom = "Bottom",
}
const positionsIcons = {
  Top: <ArrowUp />,
  Left: <ArrowLeft />,
  Right: <ArrowRight />,
  Bottom: <ArrowDown />,
};

const MenuLink = ({ view }: { view: DevtoolsModule }) => {
  const css = styles.useStyles();
  const { module, setModule } = useDevtoolsContext("DevtoolsMenuLink");

  const Icon = menuIcons[view];
  const isActive = module === view;
  const onClick = () => setModule(view);

  return (
    <button type="button" onClick={onClick} className={css.clsx(css.menuLink, { [css.active]: isActive })}>
      <Icon />
      {view}
    </button>
  );
};

export const Menu = (props: React.HTMLProps<HTMLDivElement>) => {
  const css = styles.useStyles();
  const { theme, setTheme, isOnline, setIsOnline, position, setPosition } = useDevtoolsContext("DevtoolsMenuLink");

  return (
    <div {...props} className={css.menu}>
      {Object.values(DevtoolsModule).map((view) => (
        <MenuLink key={view} view={view} />
      ))}
      <div style={{ flex: 1 }} />
      <IconButton onClick={() => setIsOnline(!isOnline)}>
        {isOnline ? <Wifi stroke={tokens.colors.green[500]} /> : <WifiOff />}
      </IconButton>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <Settings />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.Label>
            <Settings />
            Settings
          </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Theme</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme as any}>
                <DropdownMenu.RadioItem value="light">
                  Light
                  <DropdownMenu.Shortcut>
                    <Sun />
                  </DropdownMenu.Shortcut>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="dark">
                  Dark
                  <DropdownMenu.Shortcut>
                    <MoonStar />
                  </DropdownMenu.Shortcut>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Position</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenu.RadioGroup value={position} onValueChange={setPosition as any}>
                {Object.values(Positions).map((item) => (
                  <DropdownMenu.RadioItem key={item} value={item}>
                    {item}
                    <DropdownMenu.Shortcut>{positionsIcons[item]}</DropdownMenu.Shortcut>
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
