import { DoughnutController, Plugin } from "chart.js";

// type StandardChartType = myType & { chart: typeof Chart };
//
// type myType = {
//   config: {
//     options: {
//       plugins: {
//         center: {};
//       };
//     };
//   };
// };

export const centerPlugin: Plugin<"doughnut", any> = {
  id: "center-text-plugin",
  beforeDraw: (chart: any) => {
    if (chart.config.options.elements?.center !== undefined) {
      // only use plugin for doughnut charts
      if (
        chart._metasets.length === 0 ||
        chart._metasets[0].type !== "doughnut"
      ) {
        return;
      }

      // Get ctx
      const ctx: CanvasRenderingContext2D = chart.ctx;

      // Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || "Arial";
      const lineHeight = centerConfig.lineHeight || 25;
      const txt = centerConfig.text;
      const color = centerConfig.color || "#000";
      const maxFontSize = centerConfig.maxFontSize || 75;
      const sidePadding = centerConfig.sidePadding || 20;

      const controller: DoughnutController = chart._metasets[0].controller;
      const sidePaddingCalculated =
        (sidePadding / 100) * (controller.innerRadius * 2);
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = controller.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = controller.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      let minFontSize = centerConfig.minFontSize;

      let wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      let centerY =
        (chart.chartArea.top + chart.chartArea.bottom) / 2 + fontSizeToUse / 10;
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      const words = txt.split(" ");
      let line = "";
      const lines = [];

      // Break words up into multiple lines if necessary
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (let n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  },
};
