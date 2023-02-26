export default interface ITakeScreenshot {
  pageUrl: string;
  screenWidth?: number;
  screenHeight?: number;
  saveFile: boolean;
  fileName?: string;
}
