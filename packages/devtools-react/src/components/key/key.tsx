import React from "react";
import { BadgeCheckIcon, Boxes } from "lucide-react";

import { createStyles } from "theme/use-styles.hook";

const styles = createStyles(({ css }) => {
  return {
    base: css`
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      & svg {
        width: 20px;
        height: 20px;
      }
    `,
    text: css`
      display: block;
      max-width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `,
  };
});

const colorsVariants = createStyles(({ isLight, css, tokens }) => {
  return {
    queue: css`
      & svg {
        stroke: ${isLight ? tokens.colors.cyan[300] : tokens.colors.cyan[300]};
      }
    `,
    cache: css`
      & svg {
        fill: ${isLight ? tokens.colors.cyan[300] : tokens.colors.cyan[300]};
      }
    `,
  };
});

const getKeyIcon = (type: "queue" | "cache") => {
  switch (type) {
    case "queue":
      return <Boxes />;
    case "cache":
      return <BadgeCheckIcon />;
    default:
      return null;
  }
};

export const Key = ({
  value,
  type,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement> & { value: string; type: "queue" | "cache" }) => {
  const css = styles.useStyles();
  const colorVariants = colorsVariants.useStyles();
  return (
    <div {...props} className={css.clsx(css.base, colorVariants[type], className)}>
      {getKeyIcon(type)}
      <span className={css.text}>{value}</span>
    </div>
  );
};
