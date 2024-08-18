import { tokens } from "theme/tokens";
import { createStyles } from "theme/use-styles.hook";

export const styles = createStyles((isLight, css) => {
  return {
    base: css`
      padding: 0 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

      & * {
        font-size: 12px !important;
      }
      & > ul {
        margin: 0 !important;
      }

      & ul {
        position: relative;
      }

      & label {
        min-height: 19px;
      }
      & ul > li {
        transform: translateX(-10px);
      }
      /* Expandable arrow down */
      & ul > li > div > div {
        color: ${isLight ? tokens.colors.light[400] : tokens.colors.dark[200]}!important;
      }
      & ul > li > div {
        margin-left: -6px;
      }
      /* Line under arrow */
      & ul > li > div::after {
        position: absolute;
        content: "";
        display: block;
        width: 2px;
        background: ${isLight ? tokens.colors.light[300] : tokens.colors.dark[500]};
        top: 25px;
        left: -3px;
        bottom: 5px;
      }
    `,
    value: css`
      color: inherit;
      position: relative;
      background: ${isLight ? tokens.colors.light[200] : tokens.colors.dark[400]};
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 12px;
    `,
    disabledValue: css`
      background: transparent !important;
    `,
    input: css`
      color: inherit;
      background: transparent;
      border: 0;
      letter-spacing: 0.3px;
    `,
    checkbox: css`
      position: absolute;
      margin: 0;
      left: 4px;
      top: 50%;
      transform: translate(0, -50%);
    `,
    label: css`
      position: relative;
      color: ${isLight ? tokens.colors.light[700] : tokens.colors.light[500]};
    `,
    copy: css`
      position: relative;
      width: 12px;
      height: 12px;
      background: transparent;
      border: 0;
      padding: 0;
      margin-left: 4px;

      & svg {
        width: 12px;
        height: 12px;
        transform: translateY(2px);
      }
      & svg.copied {
        fill: ${isLight ? tokens.colors.green[600] : tokens.colors.green[400]};
      }
    `,
  };
});
